import * as React from 'react';
import { Option } from '../../types';
import ButtonHref from '../../Components/ButtonHref';

export interface Props<T extends Option> {
  className: string | undefined;
  object: T;
  onRemove: (arg: T) => void;
}

function CloseButton<T extends Option>(props: Props<T>) {
  const { onRemove, object, className = 'typeahead-token-close' } = props;
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onRemove(object);
      event.preventDefault();
    },
    [object, onRemove]
  );

  return (
    <ButtonHref className={className} onClick={handleClick}>
      &#x00d7;
    </ButtonHref>
  );
}

export default CloseButton;
