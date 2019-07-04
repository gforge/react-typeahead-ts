import { useCallback, useMemo } from 'react';
import { Option } from '../../types';

interface Props<T extends Option> {
  hasHint: boolean;
  filteredOptions: T[];
  hasCustomValue: boolean;
  maxVisible: number | undefined;
  entryValue: string;
  selectionIndex: number | undefined;
  setSelectionIndex: (value: number | undefined) => void;
}

export default <T extends Option>(props: Props<T>) => {
  const {
    hasHint,
    filteredOptions,
    maxVisible,
    hasCustomValue,
    entryValue,
    selectionIndex,
    setSelectionIndex,
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
        ? filteredOptions.slice(0, maxVisible).length
        : filteredOptions.length;
      if (hasCustomValue) {
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
      filteredOptions,
      selectionIndex,
      setSelectionIndex,
      maxVisible,
      hasCustomValue,
    ]
  );

  const navDown = useCallback(() => nav(1), [nav]);
  const navUp = useCallback(() => nav(-1), [nav]);
  const clearSelection = useCallback(() => setSelectionIndex(undefined), [
    setSelectionIndex,
  ]);
  const selection = useMemo(() => {
    let index = selectionIndex;
    if (index === undefined) return undefined;

    if (hasCustomValue) {
      if (index === 0) {
        return entryValue;
      }
      index -= 1;
    }

    return filteredOptions[index];
  }, [selectionIndex, filteredOptions, hasCustomValue, entryValue]);

  return {
    nav,
    navDown,
    navUp,
    clearSelection,
    selection,
  };
};
