import * as React from 'react';
import { Props as TypelistProps } from './TypeaheadSelector';
import { CustomClasses, Option, OptionToStrFn, OptionsProps } from '../types';
import HiddenInput from '../Tokenizer/Token/HiddenInput';
import useClassNames from './helpers/useClassNames';
import useHandlers from './helpers/useHandlers';
import useOnKey from './helpers/useOnKey';
import IncrementalSearchResults from './IncrementalSearchResults';
import useHint from './helpers/useHint';
import useShouldSkipSearch from './helpers/useShouldSkipSearch';
import useSearch from './helpers/useSearch';
import useHasCustomValue from './helpers/useHasCustomValue';
import Accessor from '../accessor';
import useShowOptions from './helpers/useShowOptions';

export type AnyReactWithProps<Opt extends Option> =
  | React.Component<TypelistProps<Opt>>
  | React.PureComponent<TypelistProps<Opt>>
  | React.SFC<TypelistProps<Opt>>;

export interface Props<Opt extends Option>
  extends Pick<
      React.InputHTMLAttributes<HTMLInputElement>,
      | 'onKeyDown'
      | 'onKeyPress'
      | 'onKeyUp'
      | 'onBlur'
      | 'onFocus'
      | 'onChange'
      | 'className'
    >,
    OptionsProps<Opt> {
  name?: string;
  maxVisible?: number;
  clearOnSelection?: boolean;
  resultsTruncatedMessage?: string;
  initialValue?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  textarea?: boolean;
  allowCustomValues?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  displayOption?:
    | string
    | ((option: Opt, index?: number) => string | number)
    | undefined;
  filterOption?: string | ((value: string, option: Opt) => boolean);
  inputDisplayOption?: string | OptionToStrFn<Opt> | undefined;
  formInputOption?: string | OptionToStrFn<Opt> | undefined;
  searchOptions?: (value: string, option: Opt[]) => Opt[];
  defaultClassNames?: boolean;
  customClasses?: CustomClasses;
  customListComponent?: AnyReactWithProps<Opt>;
  showOptionsWhenEmpty?: boolean;
  innerRef?: React.MutableRefObject<HTMLInputElement | undefined>;
}

/**
 * A "typeahead", an auto-completing text input
 *
 * Renders an text input that shows options nearby that you can use the
 * keyboard or mouse to select.  Requires CSS for rendering nicely.
 */
const Typeahead = <T extends Option>(props: Props<T>) => {
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
    name,
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

  const [isFocused, setIsFocused] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);
  const [selected, setSelected] = React.useState(false);
  const { showOptions, setShowOptions } = useShowOptions({
    showOptionsWhenEmpty,
  });

  const { shouldSkipSearch } = useShouldSkipSearch({
    isFocused,
    selected,
    showOptions,
  });

  const { filteredOptions } = useSearch({
    searchOptionsFunction,
    filterOption,
    shouldSkipSearch,
    entryValue,
    options,
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

  let trueFalseOptions: OptionsProps<T>;
  if (allowCustomValues) {
    trueFalseOptions = {
      allowCustomValues: true as const,
      options,
      onOptionSelected,
    };
  } else {
    trueFalseOptions = {
      allowCustomValues: false as const,
      options,
      onOptionSelected,
    };
  }

  const option2string = React.useMemo(() => {
    const anyToStrFn = formInputOption || inputDisplayOption || displayOption;
    return Accessor.generateOptionToStringFor(anyToStrFn) as ((
      opt: T
    ) => string | number);
  }, [formInputOption, inputDisplayOption, displayOption]);

  const { hasCustomValue } = useHasCustomValue({
    allowCustomValues: !!allowCustomValues,
    entryValue,
    filteredOptions,
    option2string,
  });
  const {
    handleChange,
    handleOptionSelected,
    handleFocus,
    handleBlur,
  } = useHandlers({
    ...trueFalseOptions,
    inputElement,
    initialValue,
    setSelection,
    setEntryValue,
    onBlur,
    onFocus,
    onChange,
    clearOnSelection: !!clearOnSelection,
    displayOption,
    inputDisplayOption,
    setSelectionIndex,
    setShowResults,
    setIsFocused,
    setSelected,
    option2string,
    setShowOptions,
  });
  const { hasHint } = useHint({ filteredOptions, hasCustomValue });
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
    setShowOptions,
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
};

interface TypaheadMemoHelper {
  <T extends Option>(arg: Props<T>): JSX.Element;
}

// @ts-ignore
const MemoTypeahead: TypaheadMemoHelper = React.memo(Typeahead);

export default MemoTypeahead;
