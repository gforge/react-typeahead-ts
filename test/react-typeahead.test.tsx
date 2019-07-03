import * as React from 'react';
import { shallow } from 'enzyme';
import { Typeahead, Tokenizer } from '../src';

describe('Main entry point', () => {
  test('exports a Typeahead component with an input', () => {
    const typeahead = shallow(<Typeahead options={['a', 'b']} />);
    expect(typeahead.find('input')).toHaveLength(1);
  });

  test('exports a Tokenizer component that contains a Typeahead', () => {
    const tokenizer = shallow(<Tokenizer options={['a', 'b']} />);
    expect(tokenizer.find('Typeahead')).toHaveLength(1);
  });
});
