import * as React from 'react';
import { Option } from '../../types';

export interface Props<T extends Option> {
  className: string | undefined;
  object: T;
  onRemove: (arg: any) => void;
}

function CloseButton<T extends Option>(props: Props<T>) {
  const { onRemove, object, className = 'typeahead-token-close' } = props;
  if (!onRemove) {
    return null;
  }

  return (
    <a
      className={className}
      href="#"
      onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
        onRemove(object);
        event.preventDefault();
      }}
    >
      &#x00d7;
    </a>
  );
}

export default React.memo(CloseButton);
