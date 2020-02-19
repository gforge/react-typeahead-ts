import * as React from 'react';
import { Tokenizer } from '../../src';
import Wrapper from './ExampleWrapper';

const SimpleTokenizerExample = () => (
  <Wrapper
    title="Tokenizer with comma separation and a little style"
    code={`
            <Tokenizer
              options={['John', 'Paul', 'George', 'Ringo']}
              defaultSelected={['John']}
              separateByComma
              customClasses={{ tokenList: 'customToken' }}
            />


            # In the CSS-file:
            .customToken {
              background-color: brown;
              color: white;
              width: 100px;
              margin: auto;
              border-radius: 5px;
              margin-top: 5px;
            }
            `}
  >
    <Tokenizer
      options={['John', 'Paul', 'George', 'Ringo']}
      defaultSelected={['John']}
      separateByComma
      customClasses={{ tokenList: 'customToken' }}
    />
  </Wrapper>
);

export default React.memo(SimpleTokenizerExample);
