import * as React from 'react';
import _ from 'lodash';
import { mount } from 'enzyme';
import Tokenizer from '../../src/Tokenizer';
import Keyevent from '../../src/keyevent';
import { Option } from '../../src/types';
import simulateTextInput from '../helpers/simulateTextInput';
import simulateKeyEvent from '../helpers/simulateKeyEvent';

const BEATLES = ['John', 'Paul', 'George', 'Ringo'];

const BEATLES_COMPLEX: Option[] = [
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let testContext: any;

  beforeEach(() => {
    testContext = {};
  });

  describe('basic tokenizer', () => {
    beforeEach(() => {
      testContext.component = mount(
        <Tokenizer
          options={BEATLES}
          customClasses={{ token: 'custom-token' }}
        />
      );
    });

    test('Basic mount', () => {
      const ret = mount(<Tokenizer options={BEATLES} />);

      const html = ret.html();
      expect(html).toMatchSnapshot();
    });

    test('Complex mount', () => {
      const ret = mount(<Tokenizer options={BEATLES_COMPLEX} />);

      const html = ret.html();
      expect(html).toMatchSnapshot();
    });

    test('should fuzzy search and render matching results', () => {
      // input value: num of expected results
      const testplan = {
        o: 3,
        pa: 1,
        Grg: 1,
        Ringo: 1,
        xxx: 0,
      };

      _.each(testplan, (expected, value) => {
        simulateTextInput(testContext.component, value);
        expect(testContext.component.find('button').length).toEqual(expected);
      });
    });

    test('should have custom and default token classes', () => {
      simulateTextInput(testContext.component, 'o');
      simulateKeyEvent(testContext.component, Keyevent.DOM_VK_DOWN);
      simulateKeyEvent(testContext.component, Keyevent.DOM_VK_DOWN);
      simulateKeyEvent(testContext.component, Keyevent.DOM_VK_RETURN);

      simulateTextInput(testContext.component, 'Ringo');
      simulateKeyEvent(testContext.component, Keyevent.DOM_VK_DOWN);
      simulateKeyEvent(testContext.component, Keyevent.DOM_VK_RETURN);

      const tokens = testContext.component.find('.typeahead-token');

      expect(tokens.length).toEqual(2);
      expect(tokens.at(0)).toBeDefined();
    });

    test('should have custom and default token classes', () => {
      let results = simulateTextInput(testContext.component, 'o');
      results = simulateKeyEvent(results, Keyevent.DOM_VK_DOWN);
      simulateKeyEvent(results, Keyevent.DOM_VK_RETURN);

      expect(testContext.component.find('div.typeahead-token')).toHaveLength(1);
      expect(testContext.component.find('div.custom-token')).toHaveLength(1);
    });
  });
});
