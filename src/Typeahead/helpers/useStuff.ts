import * as React from 'react';
import {
  Option,
  OptionToStrFn,
  HandleOnOptionSelectArg,
  OptionsProps,
  EventType,
} from '../../types';
import Accessor from '../../accessor';
import useSearch from './useSearch';

interface Props<Opt extends Option> {
  entryValue: string;
  showOptionsWhenEmpty: boolean | undefined;
  setSelection: (value: string | number) => void;
  setSelectionIndex: (value: number | undefined) => void;
  setEntryValue: (value: string) => void;
  inputElement: React.MutableRefObject<HTMLInputElement | undefined>;
  initialValue: string;
  filterOption: string | ((value: string, option: Opt) => boolean) | undefined;
  searchOptionsFunction: ((value: string, option: Opt[]) => Opt[]) | undefined;
  displayOption: string | OptionToStrFn<Opt> | undefined;
  inputDisplayOption: string | OptionToStrFn<Opt> | undefined;
  formInputOption: string | OptionToStrFn<Opt> | undefined;
  onBlur: React.InputHTMLAttributes<HTMLInputElement>['onBlur'];
  onFocus: React.InputHTMLAttributes<HTMLInputElement>['onFocus'];
  onChange: React.InputHTMLAttributes<HTMLInputElement>['onChange'];
  clearOnSelection: boolean;
}

export default <T extends Option>(props: Props<T> & OptionsProps<T>) => {
  const {
    entryValue,
    options,
    showOptionsWhenEmpty,
    setSelection,
    setEntryValue,
    inputElement,
    searchOptionsFunction,
    filterOption,
    formInputOption,
    inputDisplayOption,
    displayOption,
    onBlur,
    onFocus,
    onChange,
    allowCustomValues,
    setSelectionIndex,
    clearOnSelection,
    onOptionSelected,
  } = props;
  const [isFocused, setIsFocused] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);
  const [selected, setSelected] = React.useState(false);

  const shouldSkipSearch = React.useCallback(
    (input?: string) => {
      if (selected) return true;
      const emptyValue = !input || input.trim().length === 0;

      return !(showOptionsWhenEmpty && isFocused) && emptyValue;
    },
    [selected, showOptionsWhenEmpty, isFocused]
  );

  const { filteredOptions } = useSearch({
    searchOptionsFunction,
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
      allowCustomValues ||
      entryValue.length >= 1 // TODO: add minCustomValueLength
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

      setSelection('');
      setEntryValue(value);
    },
    [inputElement, setSelection, setEntryValue]
  );

  // @ts-ignore
  const optionsProps: OptionsProps<T> = React.useMemo(
    () => ({
      allowCustomValues,
      options,
      onOptionSelected,
    }),
    [allowCustomValues, options, onOptionSelected]
  );

  const handleOptionSelected: HandleOnOptionSelectArg = React.useCallback(
    (option?: Option | string | undefined, event?: EventType) => {
      if (!option) {
        setSelection('');
        setShowResults(true);
      } else {
        setSelected(true);
        if (!inputElement.current) throw new Error('No input element');
        inputElement.current.focus();

        let optionString: string | number;
        let formInputOptionString: string | number;
        if (typeof option === 'string') {
          optionString = option as string;
          formInputOptionString = option as string;
        } else {
          const displayOption2string = Accessor.generateOptionToStringFor(
            displayOption || inputDisplayOption
          );
          optionString = displayOption2string(option);

          formInputOptionString = option2string(option);
        }
        if (clearOnSelection) {
          setSelected(false);
          optionString = '';
        }

        inputElement.current.value = `${optionString}`;
        setSelection(formInputOptionString);
        setEntryValue(`${optionString}`);
        setShowResults(false);
        setSelectionIndex(undefined);
        inputElement.current.blur();

        const orgOption = optionsProps.options.find(
          opt => option2string(opt) === formInputOptionString
        );
        if (
          optionsProps.allowCustomValues === true &&
          optionsProps.onOptionSelected
        ) {
          optionsProps.onOptionSelected(formInputOptionString, event);
        } else if (
          optionsProps.allowCustomValues === false &&
          optionsProps.onOptionSelected
        ) {
          optionsProps.onOptionSelected(orgOption, event);
        }
      }
    },
    [
      setSelection,
      inputElement,
      clearOnSelection,
      setEntryValue,
      setSelectionIndex,
      optionsProps,
      displayOption,
      inputDisplayOption,
      option2string,
    ]
  );

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(event);
      }

      handleOptionSelected(undefined);
      onTextEntryUpdated(event.target.value);
    },
    [onChange, onTextEntryUpdated, handleOptionSelected]
  );

  const hasHint = React.useMemo(() => {
    return filteredOptions.length > 0 || hasCustomValue;
  }, [filteredOptions, hasCustomValue]);

  const handleFocus = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      setShowResults(true);
      onTextEntryUpdated();
      onFocus && onFocus(event);
    },
    [onFocus, setIsFocused, onTextEntryUpdated]
  );

  const handleBlur = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onTextEntryUpdated();
      onBlur && onBlur(event);
    },
    [onBlur, setIsFocused, onTextEntryUpdated]
  );

  return {
    handleChange,
    handleOptionSelected,
    handleBlur,
    handleFocus,
    showResults,
    shouldSkipSearch,
    hasHint,
    filteredOptions,
    selected,
    hasCustomValue,
  };
};
