import * as React from 'react';
import classNames from 'classnames';
import HiddenInput from './HiddenInput';
import CloseButton from './CloseButton';
import { Option } from '../../types';

export interface Props<T extends Option> {
  className?: string;
  name?: string;
  children: React.ReactNode | string;
  object: T;
  onRemove: (arg: T) => void;
  value: string;
}

/**
 * Encapsulates the rendering of an option that has been "selected" in a
 * TypeaheadTokenizer
 */
const Token = <T extends Option>(props: Props<T>) => {
  const { name, object, value, onRemove, children, className } = props;
  return (
    <div className={classNames(['typeahead-token', className])}>
      <HiddenInput name={name} value={value} />
      {children}
      <CloseButton className={className} onRemove={onRemove} object={object} />
    </div>
  );
};

export default Token;
