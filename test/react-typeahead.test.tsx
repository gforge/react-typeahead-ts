import * as React from 'react';
import TestUtils from 'react-dom/test-utils';
import { Typeahead as ReactTypeahead, Tokenizer as ReactTokenizer } from '../src';

describe('Main entry point', () => {
  test('exports a Typeahead component', () => {
    const typeahead = TestUtils.renderIntoDocument(<ReactTypeahead options={['a', 'b']} />);
    if (!typeahead) throw new Error('Typeahead not created!');
    expect(TestUtils.isCompositeComponent(typeahead)).toBeTruthy();
  });

  test('exports a Tokenizer component', () => {
    const tokenizer = TestUtils.renderIntoDocument(<ReactTokenizer options={['a', 'b']} />);
    if (!tokenizer) throw new Error('Tokenizer not created!');
    expect(TestUtils.isCompositeComponent(tokenizer)).toBeTruthy();
  });
});
