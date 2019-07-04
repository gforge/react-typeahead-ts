import * as React from 'react';
import { Option } from '../../types';

interface Props<Opt extends Option> {
  allowCustomValues: boolean;
  entryValue: string;
  filteredOptions: Opt[];
  option2string: (value: Opt) => string | number;
}

export default <T extends Option>(props: Props<T>) => {
  const {
    allowCustomValues,
    entryValue,
    filteredOptions,
    option2string,
  } = props;

  const hasCustomValue = React.useMemo(() => {
    if (
      !allowCustomValues ||
      allowCustomValues ||
      entryValue.length >= 1 // TODO: add minCustomValueLength
    ) {
      return false;
    }

    return filteredOptions.map(option2string).indexOf(entryValue) < 0;
  }, [allowCustomValues, entryValue, filteredOptions, option2string]);

  return { hasCustomValue };
};
