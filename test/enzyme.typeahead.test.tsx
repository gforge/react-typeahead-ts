/// <reference path="../node_modules/@types/jest/index.d.ts"/>.
import * as React from 'react';
import _ from 'lodash';
// @ts-ignore
import { ReactWrapper } from 'jest';
import { mount } from 'enzyme';
import sinon from 'sinon';
import Typeahead, { Props as TProps } from '../src/typeahead';
import Keyevent from '../src/keyevent';
import { Option } from '../src/types';

// @ts-ignore
const getInput = (component: ReactWrapper<Tprops<any, any>>) => {
  let controlComponent = component.find('input.form-control');
  if (controlComponent.length === 0) {
    controlComponent = component.find('input').first();
  }

  return controlComponent;
};

const simulateTextInput = (mountedComponent: ReactWrapper<TProps<any, any>>, value: string) => {
  const inputElement = getInput(mountedComponent);

  inputElement
    .simulate('focus')
    .simulate('change', { target: { value } });

  return mountedComponent;
};


const simulateKeyEvent = (
  mountedComponent: ReactWrapper<TProps<any, any>>,
  code: string | number,
  eventName: string = 'keyDown',
) => {
  const inputElement = getInput(mountedComponent);

  inputElement.simulate('focus').simulate(eventName, { keyCode: code });

  return mountedComponent;
};

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
  let testContext: any;

  beforeEach(() => {
    testContext = {};
  });

  describe('basic tokenizer', () => {
    beforeEach(() => {
      testContext.component = mount(
        <Typeahead
          options={BEATLES}
        />);
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

      _.each(
        testplan,
        (expected, value) => {

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
        expect(getInput(results)
          .prop('value')).toEqual(BEATLES[2]);
      });

      test('up arrow + return navigates and selects an option', () => {
        let results = simulateTextInput(testContext.component, 'o');
        results = simulateKeyEvent(results, Keyevent.DOM_VK_DOWN);
        results = simulateKeyEvent(results, Keyevent.DOM_VK_DOWN);
        results = simulateKeyEvent(results, Keyevent.DOM_VK_UP);
        results = simulateKeyEvent(results, Keyevent.DOM_VK_RETURN);
        expect(getInput(results)
            .prop('value')).toEqual(BEATLES[0]);
      });

      test('navigation away + escape clears selection', () => {
        let results = simulateTextInput(testContext.component, 'o');
        results = simulateKeyEvent(results, Keyevent.DOM_VK_DOWN);
        expect(results
            .find('ul li')
            .first()
            .hasClass('hover')).toBeTruthy();
        results = simulateKeyEvent(results, Keyevent.DOM_VK_DOWN);
        expect(results
            .find('ul li')
            .first()
            .hasClass('hover')).toBeFalsy();
        results = simulateKeyEvent(results, Keyevent.DOM_VK_UP);
        expect(results
            .find('ul li')
            .first()
            .hasClass('hover')).toBeTruthy();
        results = simulateKeyEvent(results, Keyevent.DOM_VK_ESCAPE);
        expect(results
            .find('ul li')
            .first()
            .hasClass('hover')).toBeFalsy();
      });

      test('tab to choose first item', () => {
        let results = simulateTextInput(testContext.component, 'o');
        const first = results
            .find('ul li')
            .first()
            .text();

        results = simulateKeyEvent(results, Keyevent.DOM_VK_TAB);
        expect(getInput(results)
            .prop('value')).toEqual(first);
      });

      test('tab on no selection should not be undefined', () => {
        let results = simulateTextInput(testContext.component, 'oz');
        expect(results
            .find('ul li')
            .length).toEqual(0);
        results = simulateKeyEvent(results, Keyevent.DOM_VK_TAB);
        expect(getInput(results)
            .prop('value')).toEqual('oz');
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
        testContext.sinon = sinon.sandbox.create();
      });
      afterEach(() => {
        testContext.sinon.restore();
      });
      test('focuses the typeahead', () => {
        const focusSpy = sinon.spy();
        const component = mount(
          <Typeahead
            options={BEATLES}
            onFocus={focusSpy}
          />);        
        expect(focusSpy.calledOnce).toEqual(false);
        getInput(component).simulate('focus');
        
        expect(focusSpy.calledOnce).toEqual(true);
      });
    });
  });


  describe('props', () => {
    describe('maxVisible', () => {
      test('limits the result set based on the maxVisible option', () => {
        let component = mount(
          <Typeahead
            options={BEATLES}
            maxVisible={1}
          />);
        
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
          />);
        
        simulateTextInput(component, 'o');
        expect(component
            .find('ul li.results-truncated')
            .last()
            .text()).toEqual('Results truncated');
      });

      describe('displayOption', () => {
        test('renders simple options verbatim when not specified', () => {
          const component = mount(
            <Typeahead
              options={BEATLES}
            />);
          simulateTextInput(component, 'john');
          expect(component.text()).toEqual('John');
        });

        test('renders custom options when specified as a string', () => {
          const component = mount(
            <Typeahead
              options={BEATLES_COMPLEX}
              filterOption="firstName"
              displayOption="nameWithTitle"
            />);
          simulateTextInput(component, 'john');
          expect(component.text()).toEqual('John Winston Ono Lennon MBE');
        });

        test('renders custom options when specified as a function', () => {
          type Mapped = { firstName: string; lastName: string };
          const component = mount(
            <Typeahead
              options={BEATLES_COMPLEX}
              filterOption="firstName"
              displayOption={(o: Mapped, i) => `${i} ${o.firstName} ${o.lastName}`}
            />);
          simulateTextInput(component, 'john');
          expect(component.text()).toEqual('0 John Lennon');
        });
      });
    });

    describe('searchOptions', () => {
      test('maps correctly when specified with map function', () => {
        type Mapped = { len: number, orig: string };
        const createObject = (o: string): Mapped => {
          return { len: o.length, orig: o };
        };

        const component = mount(
          <Typeahead 
            options={BEATLES} 
            searchOptions={(value: string, opts: string[]) => opts
                .map(createObject)
                .filter(o => o.orig.match(RegExp(value, 'i')))}
            displayOption={(o: Mapped) => `Score: ${o.len} ${o.orig}`}
            inputDisplayOption={(o: Mapped) => o.orig} 
          />);
        
        simulateTextInput(component, 'john');
        expect(component.text()).toEqual('Score: 4 John');
      });

      test('can sort displayed items when specified with map function wrapped with sort', () => {
        type Mapped = { len: number; orig: string };
        const createObject = (o: string): Mapped => {
          return { len: o.length, orig: o };
        };

        const component = mount(
          <Typeahead 
            options={BEATLES} 
            searchOptions={(value: string, opts: string[]) => opts
              .sort()
              .map(createObject)
              .filter(o => o.orig.match(RegExp(value, 'i')))
            }
            displayOption={(o: Mapped) => `Score: ${o.len} ${o.orig}`}
            inputDisplayOption={(o: Mapped) => o.orig}
          />);

        simulateTextInput(component, 'orgE');
        expect(component.text()).toEqual('Score: 6 George');
      });
    });
  });
});
