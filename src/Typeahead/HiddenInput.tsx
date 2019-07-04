import * as React from 'react';

const HiddenInput = (props: {
  name: string;
  selection: React.InputHTMLAttributes<HTMLInputElement>['value'];
}) => {
  const { name, selection } = props;
  if (!name) {
    return null;
  }

  return <input type="hidden" name={name} value={selection} />;
};

export default React.memo(HiddenInput);
