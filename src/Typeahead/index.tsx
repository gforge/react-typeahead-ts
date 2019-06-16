import * as React from 'react';
import classNames from 'classnames';
import Accessor from '../accessor';
import TypeaheadSelector, { Props as TypelistProps } from './selector';
import KeyEvent from '../keyevent';
import {
  CustomClasses,
  Option,
  OptionToStrFn,
  OnOptionSelectArg,
  OptionsObject,
} from '../types';
import HiddenInput from '../Tokenizer/Token/HiddenInput';
import useSearch from './helpers/useSearch';

export type AnyReactWithProps =
  | React.Component<TypelistProps>
  | React.PureComponent<TypelistProps>
  | React.SFC<TypelistProps>;

export interface Props<Opt extends Option> {
  name?: string;
  customClasses?: CustomClasses;
  maxVisible?: number;
  clearOnSelection?: boolean;
  resultsTruncatedMessage?: string;
  options: Opt[];
  allowCustomValues?: number;
  initialValue?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  textarea?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  onOptionSelected?: OnOptionSelectArg<string>;
  filterOption?: string | ((value: string, option: Opt) => boolean);
  searchOptions?: (value: string, option: Opt[]) => Opt[];
  displayOption?: string | OptionToStrFn<OptionsObject>;
  inputDisplayOption?: string | OptionToStrFn<OptionsObject>;
  formInputOption?: string | OptionToStrFn<OptionsObject>;
  defaultClassNames?: boolean;
  customListComponent?: AnyReactWithProps;
  showOptionsWhenEmpty?: boolean;
  innerRef?: React.MutableRefObject<HTMLInputElement | undefined>;
  className?: string;
}

/**
 * A "typeahead", an auto-completing text input
 *
 * Renders an text input that shows options nearby that you can use the
 * keyboard or mouse to select.  Requires CSS for MASSIVE DAMAGE.
 */
function Typeahead<T extends Option>(props: Props<T>) {
  const {
    options,
    allowCustomValues = 0,
    initialValue = '',
    value = '',
    showOptionsWhenEmpty = false,
    maxVisible,
    textarea,
    defaultClassNames,
    displayOption,
    formInputOption,
    inputDisplayOption,
    searchOptions: searchOptionsFunction,
    inputProps,
    filterOption,
    disabled,
    customClasses = {},
    innerRef,
    placeholder,
    className,
  } = props;
  // The options matching the entry value
  const [searchResults, setSearchResults] = React.useState(
    initialValue || options
  );
  const [entryValue, setEntryValue] = React.useState(value);
  const [selection, setSelection] = React.useState(value);
  const [selectionIndex, setSelectionIndex] = React.useState<number>();
  const [isFocused, setIsFocused] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);
  const [selected, setSelected] = React.useState(false);

  const inputElement = React.useRef<HTMLInputElement | undefined>();

  const shouldSkipSearch = React.useCallback(
    (input?: string) => {
      if (selected) return true;
      const emptyValue = !input || input.trim().length === 0;

      return !(showOptionsWhenEmpty && isFocused) && emptyValue;
    },
    [selected, showOptionsWhenEmpty, isFocused]
  );

  const { filteredOptions, searchFunction } = useSearch({
    searchOptions: searchOptionsFunction,
    filterOption,
    shouldSkipSearch,
    entryValue,
    options,
  });

  const option2string = React.useMemo(() => {
    const anyToStrFn = formInputOption || inputDisplayOption || displayOption;
    return Accessor.generateOptionToStringFor(anyToStrFn);
  }, [formInputOption, inputDisplayOption, displayOption]);

  const hasCustomValue = React.useMemo(() => {
    if (
      !allowCustomValues ||
      allowCustomValues > 0 ||
      entryValue.length >= allowCustomValues
    ) {
      return false;
    }

    return filteredOptions.map(option2string).indexOf(entryValue) < 0;
  }, [allowCustomValues, entryValue, filteredOptions, option2string]);

  const onTextEntryUpdated = React.useCallback(
    (newValue?: string) => {
      if (!inputElement.current) throw new Error('No input element');
      const value =
        newValue === undefined ? inputElement.current.value : newValue;

      setSearchResults(searchFunction(value, options));
      setSelection('');
      setEntryValue(value);
    },
    [options, searchFunction, setSearchResults, setSelection, setEntryValue]
  );

  const hasHint = React.useMemo(() => {
    return filteredOptions.length > 0 || hasCustomValue;
  }, [filteredOptions, hasCustomValue]);

  const inputClasses: { [className: string]: boolean } = {};
  const { input } = customClasses;
  if (input) {
    inputClasses[input] = true;
  }
  const inputClassList = classNames(inputClasses);

  const classes: { [className: string]: boolean } = {
    typeahead: !!defaultClassNames,
  };
  if (className) {
    classes[className] = true;
  }
  const classList = classNames(classes);

  return (
    <div className={classList}>
      <HiddenInput name={name} value={selection} object={object} />
      <input
        ref={(c: HTMLInputElement) => {
          inputElement.current = c;
          if (innerRef) {
            innerRef.current = c;
          }
        }}
        type={textarea ? 'textarea' : 'text'}
        disabled={disabled}
        {...inputProps}
        placeholder={placeholder}
        className={inputClassList}
        value={entryValue}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onKeyPress={onKeyPress}
        onKeyUp={onKeyUp}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <IncrementalSerchResylts
        showResults={showResults && !shouldSkipSearch(entryValue)}
      />
    </div>
  );
}

export default Typeahead;
