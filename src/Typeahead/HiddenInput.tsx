import * as React from 'react';

const HiddenInput = (props: {
  name: string;
  selection: string | undefined;
}) => {
  const { name, selection } = props;
  if (!name) {
    return null;
  }

  return <input type="hidden" name={name} value={selection} />;
};

export default React.memo(HiddenInput);
