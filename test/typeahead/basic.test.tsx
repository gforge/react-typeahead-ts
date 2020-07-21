import * as React from 'react';
import _ from 'lodash';
import { mount, ReactWrapper } from 'enzyme';
import sinon from 'sinon';
import Typeahead from '../../src/Typeahead';
import Keyevent from '../../src/keyevent';
import simulateTextInput from '../helpers/simulateTextInput';
import simulateKeyEvent from '../helpers/simulateKeyEvent';
import getInput from '../helpers/getInput';
import { BEATLES } from '../helpers/data';

describe('Typeahead Component basic', () => {
  const testContext: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: ReactWrapper<any>;
    sinon: sinon.SinonSandbox;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = {} as any;

  beforeEach(() => {
    testContext.component = mount(
      <Typeahead options={BEATLES} className="test-class" separateByComma />
    );
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
      const results = simulateTextInput(testContext.component, value);
      expect(results.find('button.typeahead-option').length).toEqual(expected);
    });
  });

  describe('keyboard controls', () => {
    test('down arrow + return selects an option', () => {
      let results = simulateTextInput(testContext.component, 'o');
      results = simulateKeyEvent(results, Keyevent.DOM_VK_DOWN);
      results = simulateKeyEvent(results, Keyevent.DOM_VK_DOWN);
      results = simulateKeyEvent(results, Keyevent.DOM_VK_RETURN);
      expect(getInput(results).prop('value')).toEqual(BEATLES[2]);
    });

    test('up arrow + return navigates and selects an option', () => {
      let results = simulateTextInput(testContext.component, 'o');
      results = simulateKeyEvent(results, Keyevent.DOM_VK_DOWN);
      results = simulateKeyEvent(results, Keyevent.DOM_VK_DOWN);
      results = simulateKeyEvent(results, Keyevent.DOM_VK_UP);
      results = simulateKeyEvent(results, Keyevent.DOM_VK_RETURN);
      expect(getInput(results).prop('value')).toEqual(BEATLES[0]);
    });

    test('navigation away + escape clears selection', () => {
      let results = simulateTextInput(testContext.component, 'o');
      results = simulateKeyEvent(results, Keyevent.DOM_VK_DOWN);
      expect(results.find('ul li').first().hasClass('hover')).toBeTruthy();
      results = simulateKeyEvent(results, Keyevent.DOM_VK_DOWN);
      expect(results.find('ul li').first().hasClass('hover')).toBeFalsy();
      results = simulateKeyEvent(results, Keyevent.DOM_VK_UP);
      expect(results.find('ul li').first().hasClass('hover')).toBeTruthy();
      results = simulateKeyEvent(results, Keyevent.DOM_VK_ESCAPE);
      expect(results.find('ul li').first().hasClass('hover')).toBeFalsy();
    });

    test('tab to choose first item', () => {
      let results = simulateTextInput(testContext.component, 'o');
      const first = results.find('ul li').first().text();

      results = simulateKeyEvent(results, Keyevent.DOM_VK_TAB);
      expect(getInput(results).prop('value')).toEqual(first);
    });

    test('tab on no selection should not be undefined', () => {
      let results = simulateTextInput(testContext.component, 'oz');
      expect(results.find('ul li').length).toEqual(0);
      results = simulateKeyEvent(results, Keyevent.DOM_VK_TAB);
      expect(getInput(results).prop('value')).toEqual('oz');
    });

    test('when separateByComma = true, comma to choose first item', () => {
      let results = simulateTextInput(testContext.component, 'o');
      const first = results.find('ul li').first().text();

      results = simulateKeyEvent(results, Keyevent.DOM_VK_COMMA);
      expect(getInput(results).prop('value')).toEqual(first);
    });

    test('when separateByComma = true, comma on no selection should not be undefined', () => {
      let results = simulateTextInput(testContext.component, 'oz');
      expect(results.find('ul li').length).toEqual(0);
      results = simulateKeyEvent(results, Keyevent.DOM_VK_COMMA);
      expect(getInput(results).prop('value')).toEqual('oz');
    });
  });

  describe('mouse controls', () => {
    test('mouse click selects an option (mouseDown event)', () => {
      const results = simulateTextInput(testContext.component, 'o');
      const secondItem = results.find('ul li').at(1);
      const secondItemValue = secondItem.text();

      secondItem.simulate('click');
      expect(getInput(results).prop('value')).toEqual(secondItemValue);
    });
  });

  describe('component functions', () => {
    beforeEach(() => {
      testContext.sinon = sinon.createSandbox();
    });
    afterEach(() => {
      testContext.sinon.restore();
    });
    test('focuses the typeahead', () => {
      const focusSpy = sinon.spy();
      const component = mount(
        <Typeahead options={BEATLES} onFocus={focusSpy} />
      );
      expect(focusSpy.calledOnce).toEqual(false);
      getInput(component).simulate('focus');

      expect(focusSpy.calledOnce).toEqual(true);
    });
  });
});
