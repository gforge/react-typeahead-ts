import * as React from 'react';
import { Typeahead } from '../../src';
import Wrapper from './ExampleWrapper';

const BootstrapTypeahead = () => (
  <Wrapper
    title="Always show with Bootstrap classes"
    code={`
          <Typeahead
            options={['John', 'Paul', 'George', 'Ringo']}
            showOptionsWhenEmpty={true}
            className="inputStyle"
            customClasses={{
              results: 'list-group',
              listItem: 'list-group-item'
            }}
          />`}
  >
    <Typeahead
      options={['John', 'Paul', 'George', 'Ringo']}
      showOptionsWhenEmpty
      className="inputStyle"
      customClasses={{
        results: 'list-group',
        listItem: 'list-group-item',
      }}
    />
  </Wrapper>
);

export default React.memo(BootstrapTypeahead);
