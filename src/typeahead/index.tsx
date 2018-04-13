import * as React from 'react';
import bind from 'bind-decorator';
import Accessor from '../accessor';
import TypeaheadSelector, { Props as TypelistProps } from './selector';
import KeyEvent from '../keyevent';
import fuzzy, { FilterOptions } from 'fuzzy';
import classNames from 'classnames';
import { CustomClasses } from '../types';
import { Input, InputProps } from 'reactstrap';

export interface Props extends InputProps {
  name?: string;
  customClasses?: CustomClasses;
  maxVisible?: number;
  resultsTruncatedMessage?: string;
  options: string[];
  allowCustomValues?: number;
  initialValue?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  textarea?: boolean;
  inputProps?: object;
  onOptionSelected?: Function;
  filterOption?: string | Function;
  searchOptions?: Function;
  displayOption?: string | Function;
  inputDisplayOption?: string | Function;
  formInputOption?: string | Function;
  defaultClassNames?: boolean;
  customListComponent?: React.Component<TypelistProps>;
  showOptionsWhenEmpty?: boolean;
  innerRef?: (c: HTMLInputElement) => any;
}

export interface State {
  // The options matching the entry value
  searchResults: string[];

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
class Typeahead extends React.Component<Props, State>{
  constructor(props: Props) {
    super(props);

    this.state = {
      // The options matching the entry value
      searchResults: this.getOptionsForValue(props.initialValue, props.options),

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

  getOptionsForValue(value?: string, options?: string[]) {
    if (this.shouldSkipSearch(value)) { return []; }

    const searchOptions = this.generateSearchFunction();
    return searchOptions(value, options);
  }

  setEntryText(value: string) {
    if (!this.inputElement) return;
    this.inputElement.value = value;
    this.onTextEntryUpdated( );
  }

  @bind
  focus() {
    if (!this.inputElement) return;
    this.inputElement.focus();
  }

  private hasCustomValue() {
    const { allowCustomValues } = this.getProps();
    const { entryValue, searchResults } = this.state;
    
    return (
      allowCustomValues && 
      allowCustomValues > 0 &&
      entryValue.length >= allowCustomValues &&
      searchResults.indexOf(this.state.entryValue) < 0);
  }

  private getCustomValue() {
    if (this.hasCustomValue()) {
      return this.state.entryValue;
    }
    return undefined;
  }

  selectElement?: HTMLElement;
  private renderIncrementalSearchResults() {
    const { entryValue, selection, searchResults, selectionIndex } = this.state;
    const {
      // @ts-ignore
      maxVisible, resultsTruncatedMessage, customListComponent, 
      allowCustomValues, customClasses, defaultClassNames,
    } = this.getProps();

    // Nothing has been entered into the textbox
    if (this.shouldSkipSearch(entryValue)) {
      return '';
    }

    // Something was just selected
    if (selection) {
      return '';
    }

    const truncated: boolean = Boolean(maxVisible && searchResults.length > maxVisible);
    return (
      // @ts-ignore
      <TypeaheadSelector
        innerRef={(c: HTMLElement) => this.selectElement = c}
        options={maxVisible ? searchResults.slice(0, maxVisible) : searchResults}
        areResultsTruncated={truncated}
        resultsTruncatedMessage={resultsTruncatedMessage}
        onOptionSelected={this.onOptionSelected}
        allowCustomValues={allowCustomValues}
        customValue={this.getCustomValue()}
        customClasses={customClasses}
        selectionIndex={selectionIndex}
        defaultClassNames={defaultClassNames}
        displayOption={Accessor.generateOptionToStringFor(this.props.displayOption)} 
      />
    );
  }

  getSelection() {
    let index = this.state.selectionIndex;
    if (index === undefined) throw new Error('No index set');
    if (this.hasCustomValue()) {
      if (index === 0) {
        return this.state.entryValue;
      }
      index -= 1;
    }
    return this.state.searchResults[index];
  }

  @bind
  private onOptionSelected(option: string, event: React.SyntheticEvent<any>) {
    if (!this.inputElement) throw new Error('No input element');
    this.inputElement.focus();

    let { displayOption, formInputOption } = this.getProps();
    displayOption = Accessor
      .generateOptionToStringFor(this.props.inputDisplayOption || displayOption);
    const optionString = displayOption(option, 0);

    formInputOption = Accessor.generateOptionToStringFor(formInputOption || displayOption);
    const formInputOptionString = formInputOption(option);

    this.inputElement.value = optionString;
    this.setState({
      searchResults: this.getOptionsForValue(optionString, this.props.options),
      selection: formInputOptionString,
      entryValue: optionString,
      showResults: false,
    });
    return this.props.onOptionSelected && this.props.onOptionSelected(option, event);
  }

  @bind
  private onTextEntryUpdated() {
    if (!this.inputElement) throw new Error('No input element');
    const value = this.inputElement.value;
    this.setState({
      searchResults: this.getOptionsForValue(value, this.props.options),
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
    let option = selection ?
      selection : (this.state.searchResults.length > 0 ? this.state.searchResults[0] : undefined);

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
    events[KeyEvent.DOM_VK_RETURN] = events[KeyEvent.DOM_VK_ENTER] = this.onEnter;
    events[KeyEvent.DOM_VK_ESCAPE] = this.onEscape;
    events[KeyEvent.DOM_VK_TAB] = this.onTab;

    return events;
  }

  private nav(delta: number) {
    if (!this.hasHint()) {
      return;
    }
    const { selectionIndex, searchResults } = this.state;
    const { maxVisible } = this.getProps();
    let newIndex = selectionIndex === undefined ? 
      (delta === 1 ? 0 : delta) : selectionIndex + delta;
    let length = maxVisible ? searchResults.slice(0, maxVisible).length : searchResults.length;
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

  navDown() {
    this.nav(1);
  }

  navUp() {
    this.nav(-1);
  }

  @bind
  private onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { onChange } = this.getProps();
    if (onChange) {
      onChange(event);
    }

    this.onTextEntryUpdated();
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

    const handler = this.eventMap()[event.keyCode];

    if (handler) {
      handler(event);
    } else {
      return this.props.onKeyDown && this.props.onKeyDown(event);
    }
    // Don't propagate the keystroke back to the DOM/browser
    event.preventDefault();
  }

  componentWillReceiveProps(nextProps: Props) {
    const searchResults = this.getOptionsForValue(this.state.entryValue, nextProps.options);
    const showResults = Boolean(searchResults.length) && this.state.isFocused;
    this.setState({ searchResults, showResults });
  }

  render() {
    const { customClasses: { input }, className } = this.getProps();
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
        <Input 
          innerRef={(c: HTMLInputElement) => {
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
    if (this.props.onFocus) {
      return this.props.onFocus(event);
    }
  }

  @bind
  private onBlur(event: React.FocusEvent<HTMLInputElement>) {
    this.setState({ isFocused: false }, () => {
      this.onTextEntryUpdated();
    });
    if (this.props.onBlur) {
      return this.props.onBlur(event);
    }
  }

  private renderHiddenInput() {
    const { name } = this.getProps();
    if (!name) {
      return null;
    }

    return (
      <input
        type="hidden"
        name={name}
        value={this.state.selection}
      />
    );
  }

  private generateSearchFunction() {
    const { searchOptions, filterOption } = this.getProps();
    if (typeof searchOptions === 'function') {
      if (filterOption !== null) {
        console.warn('searchOptions prop is being used, filterOption prop will be ignored');
      }
      return searchOptions;
    } 
    
    if (typeof filterOption === 'function') {
      return (value: string, options: string[]) => {
        return options.filter(o => filterOption(value, o));
      };
    }
    
    let mapper: (input: any) => string;
    if (typeof filterOption === 'string') {
      mapper = Accessor.generateAccessor(filterOption);
    } else {
      mapper = Accessor.IDENTITY_FN;
    }
    return (value: string, options: string[]) => {
      const fuzzyOpt: FilterOptions<any> = { extract: mapper };
      return fuzzy
        .filter(value, options, fuzzyOpt)
        .map((res: { index: number }) => options[res.index]);
    };
  }

  private hasHint() {
    return this.state.searchResults.length > 0 || this.hasCustomValue();
  }
}

export default Typeahead;
