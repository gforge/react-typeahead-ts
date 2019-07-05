import * as React from 'react';

interface Props {
  selected: boolean;
  showOptions: boolean | undefined;
  isFocused: boolean;
}

export default (props: Props) => {
  const { selected, showOptions, isFocused } = props;

  const shouldSkipSearch = React.useCallback(
    (input?: string) => {
      if (selected) return true;
      const emptyValue = !input || input.trim().length === 0;

      return !(showOptions && isFocused) && emptyValue;
    },
    [selected, showOptions, isFocused]
  );

  return { shouldSkipSearch };
};
