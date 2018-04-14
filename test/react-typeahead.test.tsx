import * as React from 'react';
import TestUtils from 'react-dom/test-utils';
import { Typeahead as ReactTypeahead, Tokenizer as ReactTokenizer } from '../src';

describe('Main entry point', () => {
  test('exports a Typeahead component', () => {
    const typeahead = TestUtils.renderIntoDocument(<ReactTypeahead />);
    expect(TestUtils.isCompositeComponent(typeahead)).toBeTruthy();
  });

  test('exports a Tokenizer component', () => {
    const tokenizer = TestUtils.renderIntoDocument(<ReactTokenizer />);
    expect(TestUtils.isCompositeComponent(tokenizer)).toBeTruthy();
  });
});
