import { useCallback } from 'react';
import { Option } from '../../types';

interface Props<Opt extends Option> {
  selectedOptions: Opt[];
  typeaheadElement: React.MutableRefObject<HTMLInputElement | undefined>;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  setSelected: (args: Opt[]) => void;
  onTokenAdd?: (value: Opt) => any;
  onTokenRemove?: (value: Opt) => any;
  getInputOptionToStringMapper: (arg: Opt) => string;
}

export default <T extends Option>(props: Props<T>) => {
  const { selectedOptions, setSelected, typeaheadElement, onTokenAdd, getInputOptionToStringMapper, onTokenRemove } = props
  const getSelectedIndex = useCallback((value: T) => {
    const mapper = getInputOptionToStringMapper;
    const searchStr: string = mapper(value);
    return selectedOptions.map(mapper).indexOf(searchStr);
  }, [getInputOptionToStringMapper, selectedOptions]);

  const removeTokenForValue = useCallback(
    (value: T) => {
      const index = getSelectedIndex(value);
      if (index === -1) {
        return;
      }

      selectedOptions.splice(index, 1);
      setSelected([...selectedOptions]);
      onTokenRemove && onTokenRemove(value);
      return;
    },
    [getSelectedIndex, setSelected, selectedOptions, onTokenRemove]);

  const addTokenForValue = useCallback(
    (value: T) => {
      if (getSelectedIndex(value) !== -1) {
        return;
      }
      setSelected([...selectedOptions, value]);

      if (!typeaheadElement.current)
        throw new Error('Expected typahead to be set');

      typeaheadElement.current.value = '';
      onTokenAdd && onTokenAdd(value);
    },
    [getSelectedIndex, setSelected, selectedOptions, onTokenAdd]);

  return {
    removeTokenForValue,
    addTokenForValue,
  }
}