import { useCallback } from 'react';
import { Option } from '../../types';

interface Props<Opt extends Option> {
  selectedOptions: Opt[];
  typeaheadElement: React.MutableRefObject<HTMLInputElement | undefined>;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  setSelected: (args: Opt[]) => void;
  onTokenAdd?: (value: Opt) => void;
  onTokenRemove?: (value: Opt) => void;
  getInputOptionToStringMapper: (arg: Opt) => string;
}

export default <T extends Option>(props: Props<T>) => {
  const {
    selectedOptions,
    setSelected,
    typeaheadElement,
    onTokenAdd,
    getInputOptionToStringMapper,
    onTokenRemove,
  } = props;
  const getSelectedIndex = useCallback(
    (value: T) => {
      const mapper = getInputOptionToStringMapper;
      const searchStr: string = mapper(value);
      return selectedOptions.map(mapper).indexOf(searchStr);
    },
    [getInputOptionToStringMapper, selectedOptions]
  );

  const removeTokenForValue = useCallback(
    (value: T) => {
      const index = getSelectedIndex(value);
      if (index === -1) {
        return;
      }

      selectedOptions.splice(index, 1);
      setSelected([...selectedOptions]);
      if (onTokenRemove) {
        onTokenRemove(value);
      }

      if (typeaheadElement.current) {
        typeaheadElement.current.focus();
      }
    },
    [
      getSelectedIndex,
      setSelected,
      selectedOptions,
      onTokenRemove,
      typeaheadElement,
    ]
  );

  const addTokenForValue = useCallback(
    (value: T) => {
      if (getSelectedIndex(value) !== -1) {
        return;
      }
      setSelected([...selectedOptions, value]);

      if (onTokenAdd) {
        onTokenAdd(value);
      }

      if (typeaheadElement.current) {
        typeaheadElement.current.value = '';
        typeaheadElement.current.focus();
      }
    },
    [
      getSelectedIndex,
      setSelected,
      selectedOptions,
      typeaheadElement,
      onTokenAdd,
    ]
  );

  return {
    removeTokenForValue,
    addTokenForValue,
  };
};
