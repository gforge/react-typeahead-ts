import { useCallback } from 'react';
import KeyEvent from '../../keyevent';
import useNav, { Props as NavProps } from './useNav';
import { HandleOnOptionSelectArg, Option } from '../../types';

interface Props<Opt extends Option>
  extends Pick<React.InputHTMLAttributes<HTMLInputElement>, 'onKeyDown'>,
    Pick<
      NavProps<Opt>,
      | 'hasHint'
      | 'filteredOptions'
      | 'maxVisible'
      | 'hasCustomValue'
      | 'entryValue'
      | 'selectionIndex'
      | 'setSelectionIndex'
      | 'setShowOptions'
    > {
  selected: boolean;
  handleOptionSelected: HandleOnOptionSelectArg;
}

export default <T extends Option>(props: Props<T>) => {
  const {
    onKeyDown,
    handleOptionSelected,
    selected,
    hasHint,
    filteredOptions,
    maxVisible,
    hasCustomValue,
    entryValue,
    selectionIndex,
    setSelectionIndex,
    setShowOptions,
  } = props;
  const { navUp, navDown, clearSelection, selection } = useNav({
    hasHint,
    filteredOptions,
    maxVisible,
    hasCustomValue,
    entryValue,
    selectionIndex,
    setSelectionIndex,
    setShowOptions,
  });

  const onEnter = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!selection) {
        return onKeyDown && onKeyDown(event);
      }

      return handleOptionSelected(selection, event);
    },
    [onKeyDown, handleOptionSelected, selection]
  );

  const onTab = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      let option: T | undefined =
        selection || filteredOptions.length > 0
          ? filteredOptions[0]
          : undefined;

      if (option === undefined && hasCustomValue) {
        option = entryValue as T;
      }

      if (option !== undefined) {
        handleOptionSelected(option, event);
      }
    },
    [
      filteredOptions,
      handleOptionSelected,
      entryValue,
      hasCustomValue,
      selection,
    ]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      // If there are no visible elements, don't perform selector navigation.
      // Just pass this up to the upstream onKeydown handler.
      // Also skip if the user is pressing the shift key,
      // since none of our handlers are looking for shift
      if (!hasHint || event.shiftKey) {
        if (onKeyDown) {
          onKeyDown(event);
        }
        if (
          [KeyEvent.DOM_VK_UP, KeyEvent.DOM_VK_DOWN].includes(event.keyCode)
        ) {
          setShowOptions(true);
        }
        return;
      }

      const events: {
        [key: string]: (event: React.KeyboardEvent<HTMLInputElement>) => void;
      } = {};
      events[KeyEvent.DOM_VK_UP] = navUp;
      events[KeyEvent.DOM_VK_DOWN] = navDown;
      events[KeyEvent.DOM_VK_RETURN] = onEnter;
      events[KeyEvent.DOM_VK_ENTER] = onEnter;
      events[KeyEvent.DOM_VK_ESCAPE] = clearSelection;
      events[KeyEvent.DOM_VK_TAB] = onTab;

      const handler = events[event.keyCode];
      if (handler) {
        handler(event);
        if (!selected) {
          // Don't propagate the keystroke back to the DOM/browser
          event.preventDefault();
        }
      } else if (onKeyDown) {
        onKeyDown(event);
      }
    },
    [
      hasHint,
      navUp,
      navDown,
      onEnter,
      clearSelection,
      onTab,
      onKeyDown,
      setShowOptions,
      selected,
    ]
  );

  return { handleKeyDown };
};
