import { useCallback } from 'react';
import KeyEvent from '../../keyevent';
import useNav from './useNav';

interface Props {
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  setSelectionIndex: (args: number | undefined) => void;
  selected: boolean;
  hasHint: boolean;
  onOptionSelected?: OnOptionSelectArg<string>;
}

export default (props: Props) => {
  const {
    onKeyDown,
    onOptionSelected,
    getSelection,
    setSelectionIndex,
    selected,
    hasHint,
    filteredOptions,
  } = props;
  const onEnter = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const selection = getSelection();
      if (!selection) {
        return onKeyDown && onKeyDown(event);
      }

      return onOptionSelected(selection, event);
    },
    [onKeyDown, getSelection, onOptionSelected]
  );

  const onEscape = useCallback(() => setSelectionIndex(undefined), [
    setSelectionIndex,
  ]);

  const onTab = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const selection = getSelection();

      let option = selection
        ? selection
        : filteredOptions.length > 0
        ? filteredOptions[0]
        : undefined;

      if (option === undefined && hasCustomValue()) {
        option = getCustomValue();
      }

      if (option !== undefined) {
        return onOptionSelected(option, event);
      }
    },
    [filteredOptions, getSelection, onOptionSelected]
  );

  const { navUp, navDown } = useNav();

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      // If there are no visible elements, don't perform selector navigation.
      // Just pass this up to the upstream onKeydown handler.
      // Also skip if the user is pressing the shift key,
      // since none of our handlers are looking for shift
      if (!hasHint || event.shiftKey) {
        return onKeyDown && onKeyDown(event);
      }

      const events: {
        [key: string]: (event: React.KeyboardEvent<HTMLInputElement>) => void;
      } = {};
      events[KeyEvent.DOM_VK_UP] = navUp;
      events[KeyEvent.DOM_VK_DOWN] = navDown;
      events[KeyEvent.DOM_VK_RETURN] = events[KeyEvent.DOM_VK_ENTER] = onEnter;
      events[KeyEvent.DOM_VK_ESCAPE] = onEscape;
      events[KeyEvent.DOM_VK_TAB] = onTab;

      const handler = events[event.keyCode];
      if (handler) {
        handler(event);
        if (!selected) {
          // Don't propagate the keystroke back to the DOM/browser
          event.preventDefault();
        }
      } else {
        return onKeyDown && onKeyDown(event);
      }
    },
    [hasHint, navUp, navDown, onEnter, onEscape, onTab, onKeyDown, selected]
  );

  return { handleKeyDown };
};
