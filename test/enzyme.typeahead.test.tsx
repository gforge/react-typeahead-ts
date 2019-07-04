import * as React from 'react';
import _ from 'lodash';
import { mount } from 'enzyme';
import sinon from 'sinon';
import Typeahead from '../src/Typeahead';
import Keyevent from '../src/keyevent';
import { OptionsObject } from '../src/types';
import simulateTextInput from './helpers/simulateTextInput';
import simulateKeyEvent from './helpers/simulateKeyEvent';
import getInput from './helpers/getInput';

const BEATLES = ['John', 'Paul', 'George', 'Ringo'];

interface ComplexOption extends OptionsObject {
  firstName: string;
  lastName: string;
  nameWithTitle: string;
}

const BEATLES_COMPLEX: ComplexOption[] = [
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
        <Typeahead options={BEATLES} className="test-class" />
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
        expect(results.find('.typeahead-option').length).toEqual(expected);
      });
    });

    test('does not change the url hash when clicking on options', () => {
      const results = simulateTextInput(testContext.component, 'o');
      const first = results.find('.typeahead-option').first();
      expect(first.prop('href')).not.toBeUndefined();
      expect(first.prop('href')).not.toEqual('#');
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
        expect(
          results
            .find('ul li')
            .first()
            .hasClass('hover')
        ).toBeTruthy();
        results = simulateKeyEvent(results, Keyevent.DOM_VK_DOWN);
        expect(
          results
            .find('ul li')
            .first()
            .hasClass('hover')
        ).toBeFalsy();
        results = simulateKeyEvent(results, Keyevent.DOM_VK_UP);
        expect(
          results
            .find('ul li')
            .first()
            .hasClass('hover')
        ).toBeTruthy();
        results = simulateKeyEvent(results, Keyevent.DOM_VK_ESCAPE);
        expect(
          results
            .find('ul li')
            .first()
            .hasClass('hover')
        ).toBeFalsy();
      });

      test('tab to choose first item', () => {
        let results = simulateTextInput(testContext.component, 'o');
        const first = results
          .find('ul li')
          .first()
          .text();

        results = simulateKeyEvent(results, Keyevent.DOM_VK_TAB);
        expect(getInput(results).prop('value')).toEqual(first);
      });

      test('tab on no selection should not be undefined', () => {
        let results = simulateTextInput(testContext.component, 'oz');
        expect(results.find('ul li').length).toEqual(0);
        results = simulateKeyEvent(results, Keyevent.DOM_VK_TAB);
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

  describe('props', () => {
    describe('maxVisible', () => {
      test('limits the result set based on the maxVisible option', () => {
        let component = mount(<Typeahead options={BEATLES} maxVisible={1} />);

        simulateTextInput(component, 'o');
        expect(component.find('a.typeahead-option').length).toEqual(1);

        component = mount(<Typeahead options={BEATLES} maxVisible={2} />);

        simulateTextInput(component, 'o');
        expect(component.find('a.typeahead-option').length).toEqual(2);
      });

      // tslint:disable-next-line:max-line-length
      test('limits the result set based on the maxVisible option, and shows resultsTruncatedMessage when specified', () => {
        const component = mount(
          <Typeahead
            options={BEATLES}
            maxVisible={1}
            resultsTruncatedMessage="Results truncated"
          />
        );

        simulateTextInput(component, 'o');
        expect(
          component
            .find('ul li.results-truncated')
            .last()
            .text()
        ).toEqual('Results truncated');
      });

      describe('displayOption', () => {
        test('renders simple options verbatim when not specified', () => {
          const component = mount(<Typeahead options={BEATLES} />);
          simulateTextInput(component, 'john');
          expect(component.text()).toEqual('John');
        });

        test('renders custom options when specified as a string', () => {
          const component = mount(
            <Typeahead
              options={BEATLES_COMPLEX}
              filterOption="firstName"
              displayOption="nameWithTitle"
            />
          );
          simulateTextInput(component, 'john');
          expect(component.text()).toEqual('John Winston Ono Lennon MBE');
        });

        test('renders custom options when specified as a function', () => {
          const component = mount(
            <Typeahead
              options={BEATLES_COMPLEX}
              filterOption="firstName"
              displayOption={(o, i) => `${i} ${o.firstName} ${o.lastName}`}
            />
          );
          simulateTextInput(component, 'john');
          expect(component.text()).toEqual('0 John Lennon');
        });
      });
    });

    describe('searchOptions', () => {
      test('Simplesearch example', () => {
        const component = mount(
          <Typeahead
            options={BEATLES}
            searchOptions={(value: string, opts: string[]) =>
              opts.filter(o => o.match(RegExp(value, 'i')))
            }
            displayOption={o => `Score: ${o.length} ${o}`}
            inputDisplayOption={o => o}
          />
        );

        simulateTextInput(component, 'john');
        expect(component.text()).toEqual('Score: 4 John');
      });

      test('can sort displayed items when specified with map function wrapped with sort', () => {
        const component = mount(
          <Typeahead
            options={BEATLES}
            searchOptions={(value: string, opts: string[]) =>
              opts.sort().filter(o => o.match(RegExp(value, 'i')))
            }
            displayOption={o => `Score: ${o.length} ${o}`}
          />
        );

        simulateTextInput(component, 'orgE');
        expect(component.text()).toEqual('Score: 6 George');
      });
    });
  });
});
