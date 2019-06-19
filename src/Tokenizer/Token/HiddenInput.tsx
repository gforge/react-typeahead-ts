import * as React from 'react';

interface Props {
  name?: string;
  value: string;
}

const HiddenInput = (props: Props) => {
  const { name, value } = props;
  // If no name was set, don't create a hidden input
  if (!name) {
    return null;
  }

  return <input type="hidden" name={name + '[]'} value={value} />;
};

export default React.memo(HiddenInput);
