import * as React from 'react';
import { Typeahead } from '../../src';
import Wrapper from './ExampleWrapper';

const SimpleExample = () => (
  <Wrapper
    title="Simple typeahead"
    code={`
        <Typeahead
          options={['John', 'Paul', 'George', 'Ringo']}
          allowCustomValues
          onOptionSelected={value => console.log(value, 'Simple typeahead')}
        />`}
  >
    <Typeahead
      options={['John', 'Paul', 'George', 'Ringo']}
      allowCustomValues
      onOptionSelected={value => console.log(value, 'Simple typeahead')}
    />
  </Wrapper>
);

export default React.memo(SimpleExample);
