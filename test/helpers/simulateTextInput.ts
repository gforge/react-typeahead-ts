import { ReactWrapper } from 'enzyme';
import getInput from './getInput';
import { Props as TProps } from '../../src/Typeahead';
import { Option } from '../../src/types';

export default (
  mountedComponent: ReactWrapper<TProps<Option>>,
  value: string
) => {
  const inputElement = getInput(mountedComponent);

  inputElement.simulate('focus').simulate('change', { target: { value } });

  return mountedComponent;
};
