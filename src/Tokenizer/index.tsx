import * as React from 'react';
import Accessor from '../accessor';
import Typeahead from '../Typeahead';
import classNames from 'classnames';
import { TokenCustomClasses, Option, SelectorType } from '../types';
import Tokens from './Tokens';
import useTokenManager from './helpers/useTokenManager';

const arraysAreDifferent = (
  array1: any[] = [],
  array2: any[] = []
): boolean => {
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

export interface Props<Opt extends Option>
  extends React.InputHTMLAttributes<HTMLInputElement> {
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
  displayOption?: SelectorType;
  formInputOption?: SelectorType;
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
const TypeaheadTokenizer = <T extends Option>(props: Props<T>) => {
  const {
    defaultSelected = [],
    customClasses = {},
    allowCustomValues = 0,
    disabled = false,
    inputProps = {},
    defaultClassNames = true,
    showOptionsWhenEmpty = false,
    formInputOption,
    displayOption,
    options,
    onKeyDown,
    onTokenAdd,
    onTokenRemove,
    className,
    initialValue = '',
    maxVisible,
    resultsTruncatedMessage,
    placeholder,
    onKeyPress,
    onKeyUp,
    onFocus,
    onBlur,
    filterOption,
    searchOptions,
    renderAbove,
    name,
  } = props;

  // Memo section
  // First section gets default values
  const defaultSelected = React.useMemo(() => ds || [], [ds]);
  const customClasses = React.useMemo(() => cs || {}, [cs]);
  const inputProps = React.useMemo(() => ip || {}, [ip]);

  // Contains the selected values
  const [selected, setSelected] = React.useState<T[]>(defaultSelected);

  // More complex memo
  const getInputOptionToStringMapper = React.useMemo(() => {
    if (typeof options[0] === 'string') return Accessor.IDENTITY_FN;
    const anyToStrFn = formInputOption || displayOption;
    return Accessor.generateOptionToStringFor(anyToStrFn);
  }, [formInputOption, displayOption, options]) as (arg: T) => string;
  const cleanOptions = React.useMemo(() => {
    return options.filter((opt: T) => {
      const value: string = getInputOptionToStringMapper(opt);
      return !selected.map(getInputOptionToStringMapper).includes(value);
    });
  }, [getInputOptionToStringMapper, selected, options]);

  const typeaheadElement = React.useRef<HTMLInputElement>();

  const { removeTokenForValue, addTokenForValue } = useTokenManager({
    selectedOptions: selected,
    typeaheadElement,
    onKeyDown,
    setSelected,
    onTokenAdd,
    onTokenRemove,
    getInputOptionToStringMapper,
  });

  const {
    className,
    initialValue = '',
    maxVisible,
    resultsTruncatedMessage,
    placeholder,
    onKeyPress,
    onKeyUp,
    onFocus,
    onBlur,
    filterOption,
    searchOptions,
    renderAbove,
    name,
  } = props;
  const classes: any = {};
  const { typeahead } = customClasses;
  if (typeahead) {
    classes[typeahead] = true;
  }
  const classList: any = classNames(classes);
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
      {renderAbove && (
        <Tokens
          name={name}
          selectedOptions={selected}
          token={customClasses.token}
          formInputOption={formInputOption}
          displayOption={displayOption}
          removeTokenForValue={removeTokenForValue}
        />
      )}
      <Typeahead
        innerRef={typeaheadElement}
        className={classList}
        {...args2Pass}
        options={cleanOptions}
        // @ts-ignore
        onOptionSelected={addTokenForValue}
        onKeyDown={onKeyDown}
        clearOnSelection={true}
      />
      {!renderAbove && (
        <Tokens
          name={name}
          selectedOptions={selected}
          token={customClasses.token}
          formInputOption={formInputOption}
          displayOption={displayOption}
          removeTokenForValue={removeTokenForValue}
        />
      )}
    </div>
  );
};

export default TypeaheadTokenizer;
