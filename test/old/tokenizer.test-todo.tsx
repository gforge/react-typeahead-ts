import * as React from 'react';
import _ from 'lodash';
import sinon from 'sinon';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import TypeaheadOption from '../../src/Typeahead/TypeaheadOption';
import Tokenizer from '../../src/Tokenizer';
import Token from '../../src/Tokenizer/Token';
import Keyevent from '../../src/keyevent';

function simulateTextInput(component: Typeahead, value: string) {
  const node = component.inputElement;
  node.value = value;
  TestUtils.Simulate.change(node);
  return TestUtils.scryRenderedComponentsWithType(component, TypeaheadOption);
}

function simulateTokenInput(component: Typeahead, value: string) {
  const typeahead = component.inputElement;
  return simulateTextInput(typeahead, value);
}

function getTokens(component) {
  return TestUtils.scryRenderedComponentsWithType(component, Token);
}

const BEATLES = ['John', 'Paul', 'George', 'Ringo'];

const BEATLES_COMPLEX = [
  {
    firstName: 'John',
    lastName: 'Lennon',
    nameWithTitle: 'John Winston Ono Lennon MBE',
  },
  {
    firstName: 'Paul',
    lastName: 'McCartney',
    nameWithTitle: 'Sir James Paul McCartney MBE',
  },
  {
    firstName: 'George',
    lastName: 'Harrison',
    nameWithTitle: 'George Harrison MBE',
  },
  {
    firstName: 'Ringo',
    lastName: 'Starr',
    nameWithTitle: 'Richard Starkey Jr. MBE',
  },
];

describe('TypeaheadTokenizer Component', () => {
  let testContext: { component?: any } = {};

  beforeEach(() => {
    testContext = {};
  });

  describe('basic tokenizer', () => {
    beforeEach(() => {
      testContext.component = TestUtils.renderIntoDocument(
        <Tokenizer
          options={BEATLES}
          customClasses={{
            token: 'custom-token',
          }}
        />
      );
    });

    describe('component functions', () => {
      beforeEach(() => {
        testContext.sinon = sinon.createSandbox();
      });
      afterEach(() => {
        testContext.sinon.restore();
      });

      test('focuses the typeahead', () => {
        testContext.sinon.spy(testContext.component.refs.typeahead, 'focus');
        testContext.component.focus();
        expect(testContext.component.refs.typeahead.focus.calledOnce).toEqual(
          true
        );
      });
    });

    describe('keyboard controls', () => {
      test('down arrow + return creates a token', () => {
        const results = simulateTokenInput(testContext.component, 'o');
        const secondItem = ReactDOM.findDOMNode(results[1]).innerText;
        const node = testContext.component.refs.typeahead.refs.entry;
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_DOWN });
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_DOWN });
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_RETURN });
        const tokens = getTokens(testContext.component);
        expect(tokens[0].props.children).toEqual(secondItem); // Poor Ringo
      });

      test('up arrow + return navigates and creates a token', () => {
        const results = simulateTokenInput(testContext.component, 'o');
        const firstItem = ReactDOM.findDOMNode(results[0]).innerText;
        const node = testContext.component.refs.typeahead.refs.entry;
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_DOWN });
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_DOWN });
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_UP });
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_RETURN });
        const tokens = getTokens(testContext.component);
        expect(tokens[0].props.children).toEqual(firstItem);
      });

      test('should remove a token when BKSPC is pressed on an empty input', () => {
        // Select two items
        simulateTokenInput(testContext.component, 'o');
        const { entry } = testContext.component.refs.typeahead.refs;
        TestUtils.Simulate.keyDown(entry, { keyCode: Keyevent.DOM_VK_DOWN });
        TestUtils.Simulate.keyDown(entry, { keyCode: Keyevent.DOM_VK_RETURN });

        simulateTokenInput(testContext.component, 'o');
        TestUtils.Simulate.keyDown(entry, { keyCode: Keyevent.DOM_VK_DOWN });
        TestUtils.Simulate.keyDown(entry, { keyCode: Keyevent.DOM_VK_DOWN });
        TestUtils.Simulate.keyDown(entry, { keyCode: Keyevent.DOM_VK_RETURN });

        // re-set the typeahead entry
        let results = getTokens(testContext.component);
        const startLength = results.length;
        expect(entry.value).toEqual('');
        expect(startLength).toEqual(2);
        expect(startLength).toEqual(results.length);

        // Now press backspace with the empty entry
        TestUtils.Simulate.keyDown(entry, {
          keyCode: Keyevent.DOM_VK_BACK_SPACE,
        });
        results = getTokens(testContext.component);
        expect(results.length + 1).toEqual(startLength);
      });

      test('should not remove a token on BKSPC when input is not empty', () => {
        const input = testContext.component.refs.typeahead.refs.entry;
        const startLength = getTokens(testContext.component).length;

        input.value = 'hello';
        TestUtils.Simulate.change(input);
        TestUtils.Simulate.keyDown(input, {
          keyCode: Keyevent.DOM_VK_BACK_SPACE,
        });

        results = getTokens(testContext.component);
        expect(startLength).toEqual(results.length);
      });

      test('tab to choose first item', () => {
        const results = simulateTokenInput(testContext.component, 'o');
        const itemText = ReactDOM.findDOMNode(results[0]).innerText;
        const node = testContext.component.refs.typeahead.refs.entry;
        const tokens = getTokens(testContext.component);

        // Need to check Token list for props.children
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_TAB });

        const newTokens = getTokens(testContext.component);
        expect(tokens.length).toEqual(newTokens.length - 1);
        expect(newTokens[newTokens.length - 1].props.children).toEqual(
          itemText
        );
      });

      test('tab to selected current item', () => {
        const results = simulateTokenInput(testContext.component, 'o');
        const itemText = ReactDOM.findDOMNode(results[1]).innerText;
        const node = testContext.component.refs.typeahead.refs.entry;
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_DOWN });
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_DOWN });
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_TAB });
        const tokens = getTokens(testContext.component);
        expect(tokens[tokens.length - 1].props.children).toEqual(itemText);
      });
    });
  });

  describe('AllowCustomValues property test', () => {
    const tokenLength = 4;

    beforeEach(() => {
      testContext.sinon = sinon.createSandbox();
      testContext.tokenAdd = testContext.sinon.spy();
      testContext.tokenRemove = testContext.sinon.spy();

      testContext.component = TestUtils.renderIntoDocument(
        <Tokenizer
          options={BEATLES}
          onTokenAdd={testContext.tokenAdd}
          onTokenRemove={testContext.tokenRemove}
          allowCustomValues={tokenLength}
          customClasses={{
            customAdd: 'topcoat-custom__token',
          }}
        />
      );
    });

    afterEach(() => {
      testContext.sinon.restore();
    });

    // tslint:disable-next-line:max-line-length
    test('should not allow custom tokens that are less than specified allowCustomValues length', () => {
      const results = simulateTokenInput(testContext.component, 'abz');
      expect(0).toEqual(results.length);
    });

    test('should display custom tokens when equal or exceeds allowCustomValues value', () => {
      let results = simulateTokenInput(testContext.component, 'abzz');
      expect(1).toEqual(results.length);
      expect('abzz').toEqual(results[0].props.children);

      results = simulateTokenInput(testContext.component, 'bakercharlie');
      expect(1).toEqual(results.length);
      expect('bakercharlie').toEqual(results[0].props.customValue);
    });

    test('should not add custom class to non-custom selection', () => {
      const results = simulateTokenInput(testContext.component, 'o');
      expect(3).toEqual(results.length);
      expect(
        !ReactDOM.findDOMNode(results[0])
          .getAttribute('class')
          .match(
            new RegExp(testContext.component.props.customClasses.customAdd)
          )
      ).toBeTruthy();
    });

    test('should add custom class to custom selection', () => {
      const results = simulateTokenInput(testContext.component, 'abzz');
      expect(1).toBeTruthy();
      expect(
        ReactDOM.findDOMNode(results[0])
          .getAttribute('class')
          .match(
            new RegExp(testContext.component.props.customClasses.customAdd)
          )
      ).toBeTruthy();
    });

    test('should allow selection of custom token', () => {
      const input = testContext.component.refs.typeahead.refs.entry;
      let tokens = getTokens(testContext.component);

      TestUtils.Simulate.keyDown(input, { keyCode: Keyevent.DOM_VK_DOWN });
      TestUtils.Simulate.keyDown(input, { keyCode: Keyevent.DOM_VK_RETURN });
      tokens = getTokens(testContext.component);
      expect(tokens.length === 1).toBeTruthy();
      expect('abzz').toEqual(tokens[0].props.children);
    });

    test('should call onTokenAdd for custom token', () => {
      const input = testContext.component.refs.typeahead.refs.entry;

      TestUtils.Simulate.keyDown(input, { keyCode: Keyevent.DOM_VK_DOWN });
      TestUtils.Simulate.keyDown(input, { keyCode: Keyevent.DOM_VK_RETURN });

      expect(testContext.tokenAdd.called).toBeTruthy();
      expect(testContext.tokenAdd.calledWith('abzz')).toBeTruthy();
    });

    test('should call onTokenRemove for custom token', () => {
      const input = testContext.component.refs.typeahead.refs.entry;
      let tokens = getTokens(testContext.component);

      TestUtils.Simulate.keyDown(input, { keyCode: Keyevent.DOM_VK_DOWN });
      TestUtils.Simulate.keyDown(input, { keyCode: Keyevent.DOM_VK_RETURN });

      expect(testContext.tokenAdd.called).toBeTruthy();
      expect(testContext.tokenAdd.calledWith('abzz')).toBeTruthy();

      tokens = getTokens(testContext.component);
      const tokenClose = TestUtils.scryRenderedDOMComponentsWithTag(
        tokens[0],
        'a'
      )[0];
      TestUtils.Simulate.click(tokenClose);
      expect(testContext.tokenRemove.called).toBeTruthy();
      expect(testContext.tokenRemove.calledWith('abzz')).toBeTruthy();
    });

    test('should not return undefined for a custom token when not selected', () => {
      const input = testContext.component.refs.typeahead.refs.entry;
      const tokens = getTokens(testContext.component);
      TestUtils.Simulate.keyDown(input, { keyCode: Keyevent.DOM_VK_TAB });

      const newTokens = getTokens(testContext.component);
      // behavior is custom token is selected
      expect(tokens.length < newTokens.length).toBeTruthy();
      expect(input.value === '').toBeTruthy();
      expect(newTokens[0].props.children).toEqual('abzz');
    });

    test('should not select value for a custom token when too short', () => {
      const input = testContext.component.refs.typeahead.refs.entry;
      TestUtils.Simulate.keyDown(input, { keyCode: Keyevent.DOM_VK_TAB });

      const newTokens = getTokens(testContext.component);
      // behavior is custom token is selected
      expect(newTokens.length === 0).toBeTruthy();
      expect(input.value === 'abz').toBeTruthy();
    });
  });

  describe('defaultClassNames', () => {
    test('should remove default classNames when this prop is specified and false', () => {
      const component = TestUtils.renderIntoDocument(
        <Tokenizer options={BEATLES} defaultClassNames={false} />
      );

      expect(
        ReactDOM.findDOMNode(component).classList.contains(
          'tokenizer-typeahead'
        )
      ).toBeFalsy();
      expect(false).toEqual(component.refs.typeahead.props.defaultClassNames);
    });
  });
});
