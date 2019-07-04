import * as React from 'react';

type Props = {
  name?: React.InputHTMLAttributes<HTMLInputElement>['name'];
  value: React.InputHTMLAttributes<HTMLInputElement>['value'];
};

const HiddenInput = (props: Props) => {
  const { name, value } = props;
  // If no name was set, don't create a hidden input
  if (!name) {
    return null;
  }

  return <input type="hidden" name={name + '[]'} value={value} />;
};

export default React.memo(HiddenInput);
