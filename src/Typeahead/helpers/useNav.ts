import { useState, useCallback } from 'react';
import { Option } from '../../types';

interface Props<T extends Option> {
  hasHint: boolean;
  availableOptions: T[];
  selectionIndex: number;
  setSelectionIndex: (idx: number) => void;
  hasCustomValue: () => boolean;
  maxVisible: number | undefined;
}

export default <T extends Option>(props: Props<T>) => {
  const {
    hasHint,
    availableOptions,
    selectionIndex,
    setSelectionIndex,
    maxVisible,
    hasCustomValue,
  } = props;

  const nav = useCallback(
    (delta: number) => {
      if (!hasHint) {
        return;
      }

      let newIndex =
        selectionIndex === undefined
          ? delta === 1
            ? 0
            : delta
          : selectionIndex + delta;
      let length = maxVisible
        ? availableOptions.slice(0, maxVisible).length
        : availableOptions.length;
      if (hasCustomValue()) {
        length += 1;
      }

      if (newIndex < 0) {
        newIndex += length;
      } else if (newIndex >= length) {
        newIndex -= length;
      }

      setSelectionIndex(newIndex);
    },
    [
      hasHint,
      availableOptions,
      selectionIndex,
      setSelectionIndex,
      maxVisible,
      hasCustomValue,
    ]
  );

  const navDown = useCallback(() => nav(1), [nav]);
  const navUp = useCallback(() => nav(-1), [nav]);

  return {
    nav,
    navDown,
    navUp,
  };
};
