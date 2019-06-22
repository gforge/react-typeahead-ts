import * as React from 'react';
import { renderIntoDocument, isCompositeComponent } from 'react-dom/test-utils';
import {
  Typeahead as ReactTypeahead,
  Tokenizer as ReactTokenizer,
} from '../src';

describe('Main entry point', () => {
  test('exports a Typeahead component', () => {
    const typeahead = renderIntoDocument(
      <ReactTypeahead options={['a', 'b']} />
    );
    // @ts-ignore
    if (!typeahead) throw new Error('Typeahead not created!');
    expect(isCompositeComponent(typeahead)).toBeTruthy();
  });

  test('exports a Tokenizer component', () => {
    const tokenizer = renderIntoDocument(
      <ReactTokenizer options={['a', 'b']} />
    );
    // @ts-ignore
    if (!tokenizer) throw new Error('Tokenizer not created!');
    expect(isCompositeComponent(tokenizer)).toBeTruthy();
  });
});
