import * as React from 'react';
import bind from 'bind-decorator';
import Accessor from '../accessor';
import TypeaheadSelector, { Props as TypelistProps } from './selector';
import KeyEvent from '../keyevent';
import fuzzy, { FilterOptions } from 'fuzzy';
import classNames from 'classnames';
import { CustomClasses, Option, OptionToStrFn, OnOptionSelectArg } from '../types';

export type AnyReactWithProps<Opt extends Option> = 
  React.Component<TypelistProps<Opt>> | 
  React.PureComponent<TypelistProps<Opt>> |
  React.SFC<TypelistProps<Opt>>;

export interface Props<Opt extends Option, Mapped> extends 
  React.InputHTMLAttributes<HTMLInputElement> 
{
  name?: string;
  customClasses?: CustomClasses;
  maxVisible?: number;
  resultsTruncatedMessage?: string;
  options: Opt[];
  allowCustomValues?: number;
  initialValue?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  textarea?: boolean;
  inputProps?: object;
  onOptionSelected?: OnOptionSelectArg<Mapped>;
  filterOption?: string | ((value: string, option: Opt) => boolean);
  searchOptions?: ((value: string, option: Opt[]) => Mapped[]);
  displayOption?: string | OptionToStrFn<Mapped>;
  inputDisplayOption?: string | OptionToStrFn<Mapped>;
  formInputOption?: string | OptionToStrFn<Mapped>;
  defaultClassNames?: boolean;
  customListComponent?: AnyReactWithProps<Opt>;
  showOptionsWhenEmpty?: boolean;
  innerRef?: (c: HTMLInputElement) => any;
}

export interface State<Mapped> {
  // The options matching the entry value
  searchResults: Mapped[];

  // This should be called something else, "entryValue"
  entryValue: string;

  // A valid typeahead value
  selection?: string;

  // Index of the selection
  selectionIndex?: number;

  // Keep track of the focus state of the input element, to determine
  // whether to show options when empty (if showOptionsWhenEmpty is true)

  isFocused: boolean;
  // true when focused, false onOptionSelected
  showResults: boolean;
}

/**
 * A "typeahead", an auto-completing text input
 *
 * Renders an text input that shows options nearby that you can use the
 * keyboard or mouse to select.  Requires CSS for MASSIVE DAMAGE.
 */
class Typeahead<T extends Option, Mapped> extends React.Component<
  Props<T, Mapped>,
  State<Mapped>
> {
  constructor(props: Props<T, Mapped>) {
    super(props);

    this.state = {
      // The options matching the entry value
      searchResults: this.searchOptions(props.initialValue || '', props.options),

      // This should be called something else, "entryValue"
      entryValue: props.value || '',

      // A valid typeahead value
      selection: props.value,

      // Index of the selection
      selectionIndex: undefined,

      // Keep track of the focus state of the input element, to determine
      // whether to show options when empty (if showOptionsWhenEmpty is true)
      isFocused: false,

      // true when focused, false onOptionSelected
      showResults: false,
    };
  }

  public inputElement?: HTMLInputElement;

  // Hack due to buggy defaultprops handling in typescript
  private getProps() {
    const customClasses: CustomClasses = {};
    return {
      ...{
        customClasses,
        allowCustomValues: 0,
        initialValue: '',
        value: '',
        disabled: false,
        textarea: false,
        customListComponent: TypeaheadSelector,
        showOptionsWhenEmpty: false,
      },
      ...this.props,
    };
  }

  private shouldSkipSearch(input?: string) {
    const emptyValue = !input || input.trim().length === 0;

    // this.state must be checked because it may not be defined yet if this function
    // is called from within getInitialState
    const isFocused = this.state && this.state.isFocused;
    return !(this.props.showOptionsWhenEmpty && isFocused) && emptyValue;
  }

  searchOptions(value?: string, options?: T[]): Mapped[] {
    const { entryValue } = this.state || { entryValue: undefined };
    const searchString = value || entryValue;
    if (this.shouldSkipSearch(searchString)) {
      return [];
    }

    const searchOptions = this.generateSearchFunction();    
    return searchOptions(searchString, options || this.getProps().options);
  }

  setEntryText(value: string) {
    if (!this.inputElement) return;
    this.inputElement.value = value;
    this.onTextEntryUpdated();
  }

  @bind
  focus() {
    if (!this.inputElement) return;
    this.inputElement.focus();
  }

  private hasCustomValue() {
    const { allowCustomValues } = this.getProps();
    const { entryValue } = this.state;

    if (
      !allowCustomValues ||
      allowCustomValues > 0 ||
      entryValue.length >= allowCustomValues
    ) {
      return false;
    }

    const mapper = this.getInputOptionToStringMapper();
    return this.searchOptions().map(mapper).indexOf(this.state.entryValue) < 0;
  }

  private getCustomValue() {
    if (this.hasCustomValue()) {
      return this.state.entryValue;
    }
    return undefined;
  }

  private renderIncrementalSearchResults() {
    const { entryValue, selection, selectionIndex } = this.state;
    const {
      maxVisible,
      resultsTruncatedMessage,
      displayOption,
      allowCustomValues,
      customClasses,
      defaultClassNames,
    } = this.getProps();
    
    // Nothing has been entered into the textbox
    if (this.shouldSkipSearch(entryValue)) {
      return '';
    }

    // Something was just selected
    if (selection) {
      return '';
    }

    const searchResults = this.searchOptions();
    const truncated: boolean = Boolean(
      maxVisible && searchResults.length > maxVisible,
    );

    return (
      <TypeaheadSelector
        options={
          maxVisible ? searchResults.slice(0, maxVisible) : searchResults
        }
        areResultsTruncated={truncated}
        onOptionSelected={this.onOptionSelected}
        customValue={this.getCustomValue()}
        displayOption={Accessor.generateOptionToStringFor(displayOption)}
        {...{
          allowCustomValues,
          resultsTruncatedMessage,
          customClasses,
          selectionIndex,
          defaultClassNames,
        }}
      />
    );
  }

  getSelection(): Mapped | string | undefined {
    let index = this.state.selectionIndex;
    if (index === undefined) return undefined;

    if (this.hasCustomValue()) {
      if (index === 0) {
        return this.state.entryValue;
      }
      index -= 1;
    }

    return this.state.searchResults[index];
  }

  private inputMapper?: OptionToStrFn<Mapped>;
  private getInputOptionToStringMapper(): OptionToStrFn<Mapped> {
    if (this.inputMapper) {
      return this.inputMapper;
    }

    const {
      formInputOption,
      inputDisplayOption,
      displayOption,
    } = this.getProps();
    const anyToStrFn = formInputOption || inputDisplayOption || displayOption;
    this.inputMapper = Accessor.generateOptionToStringFor(anyToStrFn);

    return this.inputMapper;
  }

  private displayMapper?: OptionToStrFn<Mapped>;
  private getDisplayOptionToStringMapper(): OptionToStrFn<Mapped> {
    if (this.displayMapper) {
      return this.displayMapper;
    }

    const { displayOption, inputDisplayOption } = this.getProps();
    this.displayMapper = Accessor.generateOptionToStringFor(
      inputDisplayOption || displayOption,
    );

    return this.displayMapper;
  }

  private selected: boolean = false;
  @bind
  private onOptionSelected(
    option?: Mapped | string,
    event?: React.SyntheticEvent<any>,
  ) {
    if (!option) {
      this.setState({
        searchResults: this.searchOptions(),
        selection: '',
        showResults: true,
      });
      this.selected = false;
      return;
    }

    if (!this.inputElement) throw new Error('No input element');
    this.inputElement.focus();

    let optionString: string;
    let formInputOptionString: string;
    if (typeof option === 'string') {
      optionString = option as string;
      formInputOptionString = option as string;
    } else {
      const displayOption = this.getDisplayOptionToStringMapper();
      optionString = displayOption(option, 0);

      const formInputOption = this.getInputOptionToStringMapper();
      formInputOptionString = formInputOption(option);
    }

    this.inputElement.value = optionString;
    this.setState({
      searchResults: this.searchOptions(optionString),
      selection: formInputOptionString,
      entryValue: optionString,
      showResults: false,
    });

    this.props.onOptionSelected && this.props.onOptionSelected(option, event);
    this.selected = true;
  }

  @bind
  private onTextEntryUpdated(newValue?: string) {
    if (!this.inputElement) throw new Error('No input element');
    const value = newValue === undefined ? this.inputElement.value : newValue;

    this.setState({
      searchResults: this.searchOptions(value),
      selection: '',
      entryValue: value,
    });
  }

  @bind
  private onEnter(event: React.KeyboardEvent<HTMLInputElement>) {
    const selection = this.getSelection();
    if (!selection) {
      return this.props.onKeyDown && this.props.onKeyDown(event);
    }
    return this.onOptionSelected(selection, event);
  }

  @bind
  private onEscape() {
    this.setState({
      selectionIndex: undefined,
    });
  }

  @bind
  private onTab(event: React.KeyboardEvent<HTMLInputElement>) {
    const selection = this.getSelection();

    const availableOptions = this.searchOptions();
    let option = selection
      ? selection
      : availableOptions.length > 0
        ? availableOptions[0]
        : undefined;

    if (option === undefined && this.hasCustomValue()) {
      option = this.getCustomValue();
    }

    if (option !== undefined) {
      return this.onOptionSelected(option, event);
    }
  }

  eventMap() {
    const events: any = {};

    events[KeyEvent.DOM_VK_UP] = this.navUp;
    events[KeyEvent.DOM_VK_DOWN] = this.navDown;
    events[KeyEvent.DOM_VK_RETURN] = events[
      KeyEvent.DOM_VK_ENTER
    ] = this.onEnter;
    events[KeyEvent.DOM_VK_ESCAPE] = this.onEscape;
    events[KeyEvent.DOM_VK_TAB] = this.onTab;

    return events;
  }

  private nav(delta: number) {
    if (!this.hasHint()) {
      return;
    }

    const { selectionIndex } = this.state;
    const { maxVisible } = this.getProps();
    const availableOptions = this.searchOptions();
    let newIndex =
      selectionIndex === undefined
        ? delta === 1
          ? 0
          : delta
        : selectionIndex + delta;
    let length = maxVisible
      ? availableOptions.slice(0, maxVisible).length
      : availableOptions.length;
    if (this.hasCustomValue()) {
      length += 1;
    }

    if (newIndex < 0) {
      newIndex += length;
    } else if (newIndex >= length) {
      newIndex -= length;
    }

    this.setState({ selectionIndex: newIndex });
  }

  @bind
  navDown() {
    this.nav(1);
  }

  @bind
  navUp() {
    this.nav(-1);
  }

  @bind
  private onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { onChange } = this.getProps();
    if (onChange) {
      onChange(event);
    }

    this.props.onOptionSelected && this.props.onOptionSelected(undefined);
    this.onTextEntryUpdated(event.target.value);
  }

  @bind
  private onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    // If there are no visible elements, don't perform selector navigation.
    // Just pass this up to the upstream onKeydown handler.
    // Also skip if the user is pressing the shift key,
    // since none of our handlers are looking for shift
    if (!this.hasHint() || event.shiftKey) {
      return this.props.onKeyDown && this.props.onKeyDown(event);
    }

    const selectedBefore = this.selected;
    const handler = this.eventMap()[event.keyCode];
    if (handler) {
      handler(event);
      if (!selectedBefore || !this.selected) {
        // Don't propagate the keystroke back to the DOM/browser
        event.preventDefault();
      }
    } else {
      return this.props.onKeyDown && this.props.onKeyDown(event);
    }
  }

  componentWillReceiveProps(nextProps: Props<T, Mapped>) {
    const searchResults = this.searchOptions(undefined, nextProps.options);
    const showResults = Boolean(searchResults.length) && this.state.isFocused;
    this.setState({ searchResults, showResults });
  }

  render() {
    const {
      customClasses: { input },
      className,
    } = this.getProps();
    const inputClasses: any = {};
    if (input) {
      inputClasses[input] = true;
    }
    const inputClassList = classNames(inputClasses);

    const classes: any = {
      typeahead: this.props.defaultClassNames,
    };
    if (className) {
      classes[className] = true;
    }
    const classList = classNames(classes);

    return (
      <div className={classList}>
        {this.renderHiddenInput()}
        <input
          ref={(c: HTMLInputElement) => {
            this.inputElement = c;
            this.props.innerRef && this.props.innerRef(c);
          }}
          type={this.props.textarea ? 'textarea' : 'text'}
          disabled={this.props.disabled}
          {...this.props.inputProps}
          placeholder={this.props.placeholder}
          className={inputClassList}
          value={this.state.entryValue}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          onKeyPress={this.props.onKeyPress}
          onKeyUp={this.props.onKeyUp}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
        {this.state.showResults && this.renderIncrementalSearchResults()}
      </div>
    );
  }

  @bind
  private onFocus(event: React.FocusEvent<HTMLInputElement>) {
    this.setState({ isFocused: true, showResults: true }, () => {
      this.onTextEntryUpdated();
    });
    this.props.onFocus && this.props.onFocus(event);
  }

  @bind
  private onBlur(event: React.FocusEvent<HTMLInputElement>) {
    this.setState({ isFocused: false }, () => {
      this.onTextEntryUpdated();
    });
    this.props.onBlur && this.props.onBlur(event);
  }

  private renderHiddenInput() {
    const { name } = this.getProps();
    if (!name) {
      return null;
    }

    return <input type="hidden" name={name} value={this.state.selection} />;
  }

  private searchFunction?: (value: string, options: T[]) => Mapped[];
  private generateSearchFunction(): (value: string, options: T[]) => Mapped[] {
    if (this.searchFunction) {
      return this.searchFunction;
    }
    const { searchOptions, filterOption } = this.getProps();
    if (typeof searchOptions === 'function') {
      if (filterOption !== undefined) {
        console.warn(
          'searchOptions prop is being used, filterOption prop will be ignored',
        );
      }

      this.searchFunction = searchOptions;

    } else if (typeof filterOption === 'function') {
  
      this.searchFunction = (value: string, options: T[]): Mapped[] =>
      options.filter(o => filterOption(value, o)).map(a => a as any);
      
    } else {
  
      let mapper: (input: any) => string;
      if (typeof filterOption === 'string') {
        mapper = Accessor.generateAccessor(filterOption);
      } else {
        mapper = Accessor.IDENTITY_FN;
      }
      
      
      this.searchFunction = (value: string, options: T[]) => {
        const fuzzyOpt: FilterOptions<any> = { extract: mapper };
        return fuzzy
          .filter(value, options, fuzzyOpt)
          .map((res: { index: number }) => options[res.index] as any);
      };
    }

    return this.searchFunction;
  }

  private hasHint() {
    return this.searchOptions().length > 0 || this.hasCustomValue();
  }
}

export default Typeahead;
