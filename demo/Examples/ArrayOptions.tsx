import * as React from 'react';
import { Typeahead } from '../../src';
import Wrapper from './ExampleWrapper';

const SimpleExample = () => (
  <Wrapper
    title="Pass object array as option"
    code={`
      <Typeahead
        options={[
          { id: 1, name: 'John' },
          { id: 2, name: 'Paul' },
          { id: 3, name: 'George' },
          { id: 4, name: 'Ringo' },
        ]}
        filterOption="name"
        displayOption="name"
        maxVisible={2}
        showOptionsWhenEmpty={true}
      />`}
  >
    <Typeahead
      options={[
        { id: 1, name: 'John' },
        { id: 2, name: 'Paul' },
        { id: 3, name: 'George' },
        { id: 4, name: 'Ringo' },
      ]}
      filterOption="name"
      displayOption="name"
      maxVisible={2}
      showOptionsWhenEmpty
    />
  </Wrapper>
);

export default React.memo(SimpleExample);
