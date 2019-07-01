import { ReactWrapper } from 'enzyme';
import getInput from './getInput';
import { Props as TProps } from '../../src/Typeahead';
import { Option } from '../../src/types';

export default (
  mountedComponent: ReactWrapper<TProps<Option>>,
  code: string | number,
  eventName: string = 'keyDown'
) => {
  const inputElement = getInput(mountedComponent);

  inputElement.simulate('focus').simulate(eventName, { keyCode: code });

  return mountedComponent;
};
