import * as React from 'react';
import Accessor from '../accessor';
import Token from './token';
import KeyEvent from '../keyevent';
import Typeahead from '../typeahead';
import classNames from 'classnames';
import { TokenCustomClasses, Option, OptionToStrFn } from '../types';

const arraysAreDifferent = (array1: any[] = [], array2: any[] = []): boolean => {
  if (array1.length !== array2.length) {
    return true;
  }

  for (let i = array2.length - 1; i >= 0; i -= 1) {
    if (array2[i] !== array1[i]) {
      return true;
    }
  }

  return false;
};

export interface Props<Opt extends Option> extends React.InputHTMLAttributes<HTMLInputElement> {
  name?: string;
  options: Opt[];
  customClasses?: TokenCustomClasses;
  allowCustomValues?: number;
  defaultSelected?: any[];
  initialValue?: string;
  placeholder?: string;
  disabled?: boolean;
  inputProps?: object;
  onTokenRemove?: (value: Opt) => any;
  onTokenAdd?: (value: Opt) => any;
  filterOption?: string | Function;
  searchOptions?: Function;
  displayOption?: string | OptionToStrFn<Opt>;
  formInputOption?: string | OptionToStrFn<Opt>;
  maxVisible?: number;
  resultsTruncatedMessage?: string;
  defaultClassNames?: boolean;
  showOptionsWhenEmpty?: boolean;
  innerRef?: (c: HTMLInputElement) => any;
  renderAbove?: boolean;
}

export interface State<Opt extends Option> {
  selected: Opt[];
}

/**
 * A typeahead that, when an option is selected, instead of simply filling
 * the text entry widget, prepends a renderable "token", that may be deleted
 * by pressing backspace on the beginning of the line with the keyboard.
 */
class TypeaheadTokenizer<T> extends React.Component<Props<T>, State<T>> {
  constructor(props: Props<T>) {
    super(props);

    const { defaultSelected = [] } = props;
    this.state = {
      // We need to copy this to avoid incorrect sharing
      // of state across instances (e.g., via getDefaultProps())
      selected: defaultSelected.slice(0),
    };
  }

  private getProps() {
    const customClasses: TokenCustomClasses = {};
    return {
      ...{
        customClasses,
        allowCustomValues: 0,
        disabled: false,
        inputProps: {},
        defaultClassNames: true,
        showOptionsWhenEmpty: false,
      },
      ...this.props,
    };
  }

  private inputMapper?: OptionToStrFn<T>;
  private getInputOptionToStringMapper(): OptionToStrFn<T> {
    if (this.inputMapper) {
      return this.inputMapper;
    }

    const { formInputOption, displayOption } = this.getProps();
    const anyToStrFn = formInputOption || displayOption;
    this.inputMapper = Accessor.generateOptionToStringFor(anyToStrFn);

    return this.inputMapper;
  }

  componentWillReceiveProps(nextProps: Props<T>) {
    // if we get new defaultProps, update selected
    const { defaultSelected = [] } = nextProps;
    if (arraysAreDifferent(this.props.defaultSelected, defaultSelected)) {
      this.setState({ selected: defaultSelected.slice(0) });
    }
  }

  typeaheadElement?: HTMLInputElement;
  focus() {
    if (!this.typeaheadElement) throw new Error('No typeahead element');
    this.typeaheadElement.focus();
  }

  getSelectedTokens() {
    return this.state.selected;
  }

  // TODO: Support initialized tokens
  //
  private renderTokens() {
    const {
      customClasses: { token }, displayOption, formInputOption, name,
    } = this.getProps();
    const tokenClasses: any = {};
    if (token) tokenClasses[token] = true;
    const classList: string = classNames(tokenClasses);

    const result = this.state.selected
      .map((selected) => {
        const displayString = Accessor.valueForOption(selected, displayOption);
        const value = Accessor.valueForOption(selected, formInputOption || displayOption);
        if (!displayString || !value) throw new Error('Expected string and value to exist');

        const key: string = displayString;
        return (
          <Token
            key={key}
            className={classList}
            onRemove={this.removeTokenForValue}
            object={selected}
            value={value}
            name={name}
          >
            {displayString}
          </Token>
        );
      });
    return result;
  }

  private getOptionsForTypeahead() {
    // return this.props.options without this.selected
    const mapper = this.getInputOptionToStringMapper();
    return this.props.options
      .filter((opt: T) => {
        const value: string = mapper(opt);
        return !this.state.selected
          .map(mapper)
          .includes(value);
      });
  }

  private onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // We only care about intercepting backspaces
    if (event.keyCode === KeyEvent.DOM_VK_BACK_SPACE) {
      return this.handleBackspace(event);
    }
    this.props.onKeyDown && this.props.onKeyDown(event);
  }

  private handleBackspace(event: React.KeyboardEvent<HTMLInputElement>) {
    // No tokens
    if (!this.state.selected.length) {
      return;
    }

    // Remove token ONLY when bksp pressed at beginning of line
    // without a selection
    if (!this.typeaheadElement) throw new Error('Expected typeahead element to exist');
    if (this.typeaheadElement.selectionStart === this.typeaheadElement.selectionEnd &&
        this.typeaheadElement.selectionStart === 0) {
      this.removeTokenForValue(
        this.state.selected[this.state.selected.length - 1]);
      event.preventDefault();
    }
  }

  private getSelectedIndex(value: T) {
    const mapper = this.getInputOptionToStringMapper();
    const searchStr: string = mapper(value);
    return this.state.selected
      .map(mapper)
      .indexOf(searchStr);
  }

  private removeTokenForValue = (value: T) => {
    const index = this.getSelectedIndex(value);
    if (index === -1) {
      return;
    }

    this.state.selected.splice(index, 1);
    this.setState({ selected: this.state.selected });
    this.props.onTokenRemove && this.props.onTokenRemove(value);
    return;
  }

  private addTokenForValue = (value: T) => {
    let { selected } = this.state;

    if (this.getSelectedIndex(value) !== -1) {
      return;
    }
    selected = [...selected, value];

    this.setState({ selected });

    if (!this.typeaheadElement) throw new Error('Expected typahead to be set');

    this.typeaheadElement.value = '';
    this.props.onTokenAdd && this.props.onTokenAdd(value);
  }

  render() {
    const {
      className, customClasses = {}, disabled, inputProps,
      allowCustomValues, initialValue = '',
      maxVisible, resultsTruncatedMessage, placeholder,
      onKeyPress, onKeyUp, onFocus, onBlur,
      showOptionsWhenEmpty, displayOption,
      defaultClassNames, filterOption,
      searchOptions, renderAbove,
    } = this.getProps();
    const classes: any = {};
    const { typeahead } = customClasses;
    if (typeahead) {
      classes[typeahead] = true;
    }
    const classList:any = classNames(classes);
    const tokenizerClasses: string[] = [];
    if (defaultClassNames) {
      tokenizerClasses.push('typeahead-tokenizer');
    }
    if (className) {
      tokenizerClasses.push(className);
    }
    const tokenizerClassList = classNames(tokenizerClasses);

    const args2Pass = {
      placeholder,
      disabled,
      inputProps,
      customClasses,
      allowCustomValues,
      initialValue,
      maxVisible,
      resultsTruncatedMessage,
      onKeyPress,
      onKeyUp,
      onFocus,
      onBlur,
      displayOption,
      defaultClassNames,
      filterOption,
      searchOptions,
      showOptionsWhenEmpty,
    };

    return (
      <div className={tokenizerClassList}>
        {renderAbove && this.renderTokens()}
        <Typeahead
          innerRef={(c: HTMLInputElement) => this.typeaheadElement = c}
          className={classList}
          {...args2Pass}
          options={this.getOptionsForTypeahead()}
          // @ts-ignore
          onOptionSelected={this.addTokenForValue}
          onKeyDown={this.onKeyDown}
          clearOnSelection={true}
        />
        {!renderAbove && this.renderTokens()}
      </div>
    );
  }
}

export default TypeaheadTokenizer;
