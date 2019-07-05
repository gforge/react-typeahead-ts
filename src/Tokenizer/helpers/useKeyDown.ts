import { useCallback } from 'react';
import { Option } from '../../types';
import KeyEvent from '../../keyevent';

interface Props {
  selectedOptions: Option[];
  typeaheadElement?: HTMLInputElement;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  removeTokenForValue: (opt: Option) => void;
}

export default (props: Props) => {
  const {
    typeaheadElement,
    onKeyDown,
    selectedOptions,
    removeTokenForValue,
  } = props;

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      // We only care about intercepting backspaces
      if (event.keyCode === KeyEvent.DOM_VK_BACK_SPACE) {
        // No tokens
        if (!selectedOptions.length) {
          return;
        }

        // Remove token ONLY when bksp pressed at beginning of line
        // without a selection
        if (!typeaheadElement)
          throw new Error('Expected typeahead element to exist');
        if (
          typeaheadElement.selectionStart === typeaheadElement.selectionEnd &&
          typeaheadElement.selectionStart === 0
        ) {
          removeTokenForValue(selectedOptions[selectedOptions.length - 1]);
          event.preventDefault();
        }
        if (onKeyDown) {
          onKeyDown(event);
        }
      }
    },
    [typeaheadElement, onKeyDown, selectedOptions, removeTokenForValue]
  );

  return handleKeyDown;
};
