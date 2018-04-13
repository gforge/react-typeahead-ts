import * as React from 'react';
import { assert } from 'chai';
import TestUtils from 'react-addons-test-utils';
import { Typeahead as ReactTypeahead, Tokenizer as ReactTokenizer } from '../src';

describe('Main entry point', function() {

  it('exports a Typeahead component', function() {
    var typeahead = TestUtils.renderIntoDocument(<ReactTypeahead />);
    assert.ok(TestUtils.isCompositeComponent(typeahead));
  });

  it('exports a Tokenizer component', function() {
    var tokenizer = TestUtils.renderIntoDocument(<ReactTokenizer />);
    assert.ok(TestUtils.isCompositeComponent(tokenizer));
  });

});
