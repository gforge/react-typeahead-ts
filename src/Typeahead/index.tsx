import * as React from 'react';
import { Props as TypelistProps } from './TypeaheadSelector';
import {
  CustomClasses,
  Option,
  OptionToStrFn,
  OptionsProps,
  TrueOptionProp,
  FalseOptionProp,
} from '../types';
import HiddenInput from '../Tokenizer/Token/HiddenInput';
import useClassNames from './helpers/useClassNames';
import useStuff from './helpers/useStuff';
import useOnKey from './helpers/useOnKey';
import IncrementalSearchResults from './IncrementalSearchResults';

export type AnyReactWithProps<Opt extends Option> =
  | React.Component<TypelistProps<Opt>>
  | React.PureComponent<TypelistProps<Opt>>
  | React.SFC<TypelistProps<Opt>>;

export interface Props<Opt extends Option>
  extends Pick<
    React.InputHTMLAttributes<HTMLInputElement>,
    | 'onChange'
    | 'className'
    | 'onBlur'
    | 'onFocus'
    | 'onKeyPress'
    | 'onKeyUp'
    | 'onKeyDown'
  > {
  name?: string;
  maxVisible?: number;
  clearOnSelection?: boolean;
  resultsTruncatedMessage?: string;
  initialValue?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  textarea?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  filterOption?: string | ((value: string, option: Opt) => boolean);
  searchOptions?: (value: string, option: Opt[]) => Opt[];
  displayOption?: string | OptionToStrFn<Opt>;
  inputDisplayOption?: string | OptionToStrFn<Opt>;
  formInputOption?: string | OptionToStrFn<Opt>;
  customClasses?: CustomClasses;
  defaultClassNames?: boolean;
  customListComponent?: AnyReactWithProps<Opt>;
  showOptionsWhenEmpty?: boolean;
  innerRef?: React.MutableRefObject<HTMLInputElement | undefined>;
}

/**
 * A "typeahead", an auto-completing text input
 *
 * Renders an text input that shows options nearby that you can use the
 * keyboard or mouse to select.  Requires CSS for MASSIVE DAMAGE.
 */
function Typeahead<T extends Option>(props: Props<T> & OptionsProps<T>) {
  const {
    options,
    allowCustomValues,
    initialValue = '',
    value = '',
    maxVisible,
    textarea,
    defaultClassNames,
    displayOption,
    formInputOption,
    inputDisplayOption,
    searchOptions: searchOptionsFunction,
    inputProps,
    disabled,
    customClasses = {},
    innerRef,
    placeholder,
    className,
    onChange,
    clearOnSelection,
    onOptionSelected,
    onKeyPress,
    onKeyUp,
    onBlur,
    onFocus,
    onKeyDown,
    filterOption,
    resultsTruncatedMessage,
    showOptionsWhenEmpty,
  } = props;
  // The options matching the entry value

  const inputElement = React.useRef<HTMLInputElement | undefined>();
  const [selection, setSelection] = React.useState<string | number>(value);
  const [selectionIndex, setSelectionIndex] = React.useState<number>();
  const [entryValue, setEntryValue] = React.useState(value || initialValue);
  const { mainClassNames, inputClassNames } = useClassNames({
    customClasses,
    className,
    defaultClassNames,
  });
  const setRef = React.useCallback(
    (c: HTMLInputElement) => {
      inputElement.current = c;
      if (innerRef) {
        innerRef.current = c;
      }
    },
    [inputElement, innerRef]
  );

  let trueFalseOptions: TrueOptionProp<T> | FalseOptionProp<T>;
  if (allowCustomValues) {
    // @ts-ignore
    trueFalseOptions = {
      allowCustomValues: true as const,
      options,
      onOptionSelected,
    };
  } else {
    // @ts-ignore
    trueFalseOptions = {
      allowCustomValues: false as const,
      options,
      onOptionSelected,
    };
  }
  const {
    handleChange,
    handleOptionSelected,
    handleFocus,
    handleBlur,
    showResults,
    shouldSkipSearch,
    hasHint,
    hasCustomValue,
    filteredOptions,
    selected,
  } = useStuff({
    ...trueFalseOptions,
    entryValue,
    inputElement,
    initialValue,
    setSelection,
    setEntryValue,
    searchOptionsFunction,
    onBlur,
    onFocus,
    onChange,
    clearOnSelection: !!clearOnSelection,
    displayOption,
    formInputOption,
    inputDisplayOption,
    filterOption,
    setSelectionIndex,
    showOptionsWhenEmpty,
  });
  const { handleKeyDown } = useOnKey({
    onKeyDown,
    handleOptionSelected,
    selected,
    hasHint,
    filteredOptions,
    maxVisible,
    hasCustomValue,
    entryValue,
    selectionIndex,
    setSelectionIndex,
  });

  return (
    <div className={mainClassNames}>
      <HiddenInput name={name} value={selection} />
      <input
        ref={setRef}
        type={textarea ? 'textarea' : 'text'}
        disabled={disabled}
        {...inputProps}
        placeholder={placeholder}
        className={inputClassNames}
        value={entryValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onKeyPress={onKeyPress}
        onKeyUp={onKeyUp}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <IncrementalSearchResults
        showResults={showResults && !shouldSkipSearch(entryValue)}
        hasCustomValue={hasCustomValue}
        entryValue={entryValue}
        selection={selection}
        maxVisible={maxVisible}
        handleOptionSelected={handleOptionSelected}
        displayOption={displayOption}
        allowCustomValues={allowCustomValues}
        resultsTruncatedMessage={resultsTruncatedMessage}
        customClasses={customClasses}
        selectionIndex={selectionIndex}
        defaultClassNames={defaultClassNames}
        filteredOptions={filteredOptions}
      />
    </div>
  );
}

export default Typeahead;
