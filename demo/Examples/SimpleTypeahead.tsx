import * as React from 'react';
import { Typeahead } from '../../src';
import Wrapper from './ExampleWrapper';

const SimpleExample = () => (
  <Wrapper
    title="Simple typeahead"
    code={`
        <Typeahead
          options={['John', 'Paul', 'George', 'Ringo']}
        />`}
  >
    <Typeahead options={['John', 'Paul', 'George', 'Ringo']} />
  </Wrapper>
);

export default React.memo(SimpleExample);
