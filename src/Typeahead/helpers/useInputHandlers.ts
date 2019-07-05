import * as React from 'react';

interface Props
  extends Pick<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'className' | 'onBlur' | 'onFocus'
  > {
  handleOptionSelected: (value: string | undefined) => void;
  onTextEntryUpdated: (value?: string | undefined) => void;
  setIsFocused: (selected: boolean) => void;
  setShowResults: (selected: boolean) => void;
  setShowOptions: (show: boolean) => void;
}

export default (props: Props) => {
  const {
    onChange,
    handleOptionSelected,
    onFocus,
    onTextEntryUpdated,
    onBlur,
    setIsFocused,
    setShowResults,
    setShowOptions,
  } = props;

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleOptionSelected(undefined);
      onTextEntryUpdated(event.target.value);
      if (onChange) {
        onChange(event);
      }
    },
    [onChange, onTextEntryUpdated, handleOptionSelected]
  );

  const handleFocus = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      setShowResults(true);
      onTextEntryUpdated();
      if (onFocus) {
        onFocus(event);
      }
    },
    [onFocus, setIsFocused, onTextEntryUpdated, setShowResults]
  );

  const handleBlur = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onTextEntryUpdated();
      if (onBlur) {
        onBlur(event);
      }
      setShowOptions(false);
    },
    [onBlur, setIsFocused, onTextEntryUpdated, setShowOptions]
  );

  return { handleBlur, handleFocus, handleChange };
};
