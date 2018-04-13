import * as React from 'react';
import Accessor from '../accessor';
import Token from './token';
import KeyEvent from '../keyevent';
import Typeahead from '../typeahead';
import classNames from 'classnames';
import { InputProps } from 'reactstrap';
import { TokenCustomClasses } from '../types';

const arraysAreDifferent = (array1: any[], array2: any[]): boolean => {
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

export interface Props extends InputProps {
  name: string;
  options: any[];
  customClasses?: TokenCustomClasses;
  allowCustomValues?: number;
  defaultSelected: any[];
  initialValue?: string;
  placeholder?: string;
  disabled?: boolean;
  inputProps: object;
  onTokenRemove?: Function;
  onTokenAdd?: Function;
  filterOption?: string | Function;
  searchOptions?: Function;
  displayOption?: string | ((arg: any) => string);
  formInputOption?: string | ((arg: any) => string);
  maxVisible?: number;
  resultsTruncatedMessage?: string;
  defaultClassNames?: boolean;
  showOptionsWhenEmpty?: boolean;
}

export interface State {
  selected: string[];
}

/**
 * A typeahead that, when an option is selected, instead of simply filling
 * the text entry widget, prepends a renderable "token", that may be deleted
 * by pressing backspace on the beginning of the line with the keyboard.
 */
class TypeaheadTokenizer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      // We need to copy this to avoid incorrect sharing
      // of state across instances (e.g., via getDefaultProps())
      selected: this.props.defaultSelected.slice(0),
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
        displayOption: (token: any) => token,
        showOptionsWhenEmpty: false,
      },
      ...this.props,
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    // if we get new defaultProps, update selected
    if (arraysAreDifferent(this.props.defaultSelected, nextProps.defaultSelected)) {
      this.setState({ selected: nextProps.defaultSelected.slice(0) });
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
        const displayString = Accessor.valueForOption(displayOption, selected);
        const value = Accessor.valueForOption(formInputOption || displayOption, selected);
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
    return this.props.options;
  }

  private onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
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

  private removeTokenForValue(value: string) {
    const index = this.state.selected.indexOf(value);
    if (index === -1) {
      return;
    }

    this.state.selected.splice(index, 1);
    this.setState({ selected: this.state.selected });
    this.props.onTokenRemove && this.props.onTokenRemove(value);
    return;
  }

  private addTokenForValue(value: string) {
    let { selected } = this.state;
    if (selected.indexOf(value) !== -1) {
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
      displayOption, defaultClassNames, filterOption, searchOptions,
      showOptionsWhenEmpty,
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
        {this.renderTokens()}
        <Typeahead 
          innerRef={(c: HTMLInputElement) => this.typeaheadElement = c}
          className={classList}
          {...args2Pass}
          options={this.getOptionsForTypeahead()}
          onOptionSelected={this.addTokenForValue}
          onKeyDown={this.onKeyDown}
        />
      </div>
    );
  }
}

export default TypeaheadTokenizer;
