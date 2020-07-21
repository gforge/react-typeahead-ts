import * as React from 'react';
import {
  Option,
  OptionToStrFn,
  HandleOnOptionSelectArg,
  OptionsProps,
  EventType,
} from '../../types';
import Accessor from '../../accessor';
import useInputHandlers from './useInputHandlers';

interface Props<Opt extends Option> {
  setSelection: (value: string | number) => void;
  setSelectionIndex: (value: number | undefined) => void;
  setEntryValue: (value: string) => void;
  inputElement: React.MutableRefObject<HTMLInputElement | undefined>;
  initialValue: string;
  displayOption: string | OptionToStrFn<Opt> | undefined;
  inputDisplayOption: string | OptionToStrFn<Opt> | undefined;
  onBlur: React.InputHTMLAttributes<HTMLInputElement>['onBlur'];
  onFocus: React.InputHTMLAttributes<HTMLInputElement>['onFocus'];
  onChange: React.InputHTMLAttributes<HTMLInputElement>['onChange'];
  clearOnSelection: boolean;
  setShowResults: (show: boolean) => void;
  setShowOptions: (show: boolean) => void;
  setSelected: (selected: boolean) => void;
  setIsFocused: (focused: boolean) => void;
  option2primitive: (value: Opt) => string | number;
}

export default <T extends Option>(props: Props<T> & OptionsProps<T>) => {
  const {
    options,
    setSelection,
    setEntryValue,
    setShowResults,
    setSelected,
    setIsFocused,
    inputElement,
    inputDisplayOption,
    displayOption,
    onBlur,
    onFocus,
    onChange,
    allowCustomValues,
    setSelectionIndex,
    clearOnSelection,
    onOptionSelected,
    option2primitive,
    setShowOptions,
  } = props;

  const onTextEntryUpdated = React.useCallback(
    (newValue?: string) => {
      if (!inputElement.current) throw new Error('No input element');
      const value =
        newValue === undefined ? inputElement.current.value : newValue;

      setSelection('');
      setEntryValue(value);
      setSelected(false);
    },
    [inputElement, setSelection, setEntryValue, setSelected]
  );

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
          const displayoption2primitive = Accessor.generateOptionToStringFor(
            displayOption || inputDisplayOption
          );
          optionString = displayoption2primitive(option);

          formInputOptionString = option2primitive(option as T);
        }
        if (clearOnSelection) {
          setSelected(false);
          optionString = '';
        }

        inputElement.current.value = `${optionString}`;
        setSelection(formInputOptionString);
        setEntryValue(`${optionString}`);
        setShowResults(false);
        setShowOptions(false);
        setSelectionIndex(undefined);
        inputElement.current.blur();

        const orgOption = optionsProps.options.find(
          (opt) => option2primitive(opt) === formInputOptionString
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
          optionsProps.onOptionSelected(
            orgOption as string | number | undefined,
            event
          );
        }
      }
    },
    [
      setSelection,
      setShowResults,
      setSelected,
      inputElement,
      clearOnSelection,
      setEntryValue,
      setShowOptions,
      setSelectionIndex,
      optionsProps,
      displayOption,
      inputDisplayOption,
      option2primitive,
    ]
  );

  const { handleBlur, handleFocus, handleChange } = useInputHandlers({
    onChange,
    onBlur,
    onFocus,
    handleOptionSelected,
    onTextEntryUpdated,
    setIsFocused,
    setShowResults,
    setShowOptions,
  });

  return {
    handleChange,
    handleOptionSelected,
    handleBlur,
    handleFocus,
  };
};
