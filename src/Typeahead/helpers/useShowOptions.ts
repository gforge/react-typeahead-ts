import * as React from 'react';

interface Props {
  showOptionsWhenEmpty: boolean | undefined;
}

export default (props: Props) => {
  const { showOptionsWhenEmpty } = props;
  const [showOptions, set] = React.useState(!!showOptionsWhenEmpty);
  const setShowOptions = React.useCallback(
    (value: boolean) => {
      if (showOptionsWhenEmpty) return;
      set(value);
    },
    [set, showOptionsWhenEmpty]
  );

  return { showOptions, setShowOptions };
};
