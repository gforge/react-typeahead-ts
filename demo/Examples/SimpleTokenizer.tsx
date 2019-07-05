import * as React from 'react';
import { Tokenizer } from '../../src';
import Wrapper from './ExampleWrapper';

const SimpleTokenizerExample = () => (
  <Wrapper
    title="Simple tokenizer"
    code={`
            <Tokenizer
              options={['John', 'Paul', 'George', 'Ringo']}
              defaultSelected={['John']}
            />`}
  >
    <Tokenizer
      options={['John', 'Paul', 'George', 'Ringo']}
      defaultSelected={['John']}
    />
  </Wrapper>
);

export default React.memo(SimpleTokenizerExample);
