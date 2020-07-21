import { ReactWrapper } from 'enzyme';
import { Props as TProps } from '../../src/Typeahead';
import { Option } from '../../src/types';

export default (component: ReactWrapper<TProps<Option>>) => {
  const controlComponent = component.findWhere(
    (n) => n.type() === 'input' && n.props().type !== 'hidden'
  );
  if (controlComponent.length === 1) {
    return controlComponent.first();
  }

  throw new Error('No input found :-(');
};
