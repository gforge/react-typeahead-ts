import * as React from 'react';

interface Props {
  name?: string;
  object: unknown;
  value: string;
}

const HiddenInput = (props: Props) => {
  const { name, value, object } = props;
  // If no name was set, don't create a hidden input
  if (!name) {
    return null;
  }

  const hiddenValue = value || object;
  if (typeof hiddenValue !== 'string') {
    throw new Error('Expected either string value or string object');
  }
  return <input type="hidden" name={name + '[]'} value={hiddenValue} />;
};

export default React.memo(HiddenInput);
