import * as React from 'react';

interface Props {
  selected: boolean;
  showOptionsWhenEmpty: boolean | undefined;
  isFocused: boolean;
}

export default (props: Props) => {
  const { selected, showOptionsWhenEmpty, isFocused } = props;

  const shouldSkipSearch = React.useCallback(
    (input?: string) => {
      if (selected) return true;
      const emptyValue = !input || input.trim().length === 0;

      return !(showOptionsWhenEmpty && isFocused) && emptyValue;
    },
    [selected, showOptionsWhenEmpty, isFocused]
  );

  return { shouldSkipSearch };
};
