import * as React from 'react';
import { Option } from '../../types';

interface Props<Opt extends Option> {
  filteredOptions: Opt[];
  hasCustomValue: boolean;
}

export default <T extends Option>(props: Props<T>) => {
  const { filteredOptions, hasCustomValue } = props;
  const hasHint = React.useMemo(() => {
    return filteredOptions.length > 0 || hasCustomValue;
  }, [filteredOptions, hasCustomValue]);

  return { hasHint };
};
