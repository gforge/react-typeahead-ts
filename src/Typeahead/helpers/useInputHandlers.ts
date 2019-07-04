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
  } = props;

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

  const handleFocus = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      setShowResults(true);
      onTextEntryUpdated();
      onFocus && onFocus(event);
    },
    [onFocus, setIsFocused, onTextEntryUpdated, setShowResults]
  );

  const handleBlur = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onTextEntryUpdated();
      onBlur && onBlur(event);
    },
    [onBlur, setIsFocused, onTextEntryUpdated]
  );

  return { handleBlur, handleFocus, handleChange };
};
