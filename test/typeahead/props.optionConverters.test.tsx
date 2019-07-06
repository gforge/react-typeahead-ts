import * as React from 'react';
import _ from 'lodash';
import { mount } from 'enzyme';
import Typeahead from '../../src/Typeahead';
import simulateTextInput from '../helpers/simulateTextInput';
import simulateKeyEvent from '../helpers/simulateKeyEvent';
import KeyEvent from '../../src/keyevent';
import { BEATLES, BEATLES_COMPLEX } from '../helpers/data';

describe('Typeahead Component props optionConverters', () => {
  describe('inputDisplayOption', () => {
    test('displays a different value in input field and in list display', () => {
      const createObject = (o: string) => ({ len: o.length, orig: o });

      const component = mount(
        <Typeahead
          name="typeahead"
          options={BEATLES.map(createObject)}
          displayOption={o => `Score: ${o.len} ${o.orig}`}
          inputDisplayOption={o => o.orig}
        />
      );

      simulateTextInput(component, 'john');
      simulateKeyEvent(component, KeyEvent.DOM_VK_TAB);

      expect(
        component.find('input[name="typeahead[]"]').get(0).props.value
      ).toEqual('John');

      expect(component.find('input[type="text"]').get(0).props.value).toEqual(
        'Score: 4 John'
      );
    });
  });

  describe('filterOption', () => {
    const FN_TEST_PLANS = [
      {
        name: 'accepts everything',
        fn() {
          return true;
        },
        input: 'xxx',
        output: 4,
      },
      {
        name: 'rejects everything',
        fn() {
          return false;
        },
        input: 'o',
        output: 0,
      },
    ];

    _.each(FN_TEST_PLANS, testplan => {
      test(`should filter with a custom function that ${testplan.name}`, () => {
        const component = mount(
          <Typeahead options={BEATLES} filterOption={testplan.fn} />
        );

        simulateTextInput(component, testplan.input);
        expect(component.find('button.typeahead-option')).toHaveLength(
          testplan.output
        );
      });
    });

    const STRING_TEST_PLANS = {
      o: 3,
      pa: 1,
      Grg: 1,
      Ringo: 1,
      xxx: 0,
    };

    test('should filter using fuzzy matching on the provided field name', () => {
      const component = mount(
        <Typeahead
          options={BEATLES_COMPLEX}
          filterOption="firstName"
          displayOption="firstName"
        />
      );

      _.each(STRING_TEST_PLANS, (expected, value) => {
        simulateTextInput(component, value);
        expect(component.find('button.typeahead-option')).toHaveLength(
          expected
        );
      });
    });
  });

  describe('formInputOption', () => {
    const FORM_INPUT_TEST_PLANS = [
      {
        name: 'uses simple options verbatim when not specified',
        props: {
          options: BEATLES,
        },
        output: 'John',
      },
      {
        name: 'defaults to the display string when not specified',
        props: {
          options: BEATLES_COMPLEX,
          filterOption: 'firstName',
          displayOption: 'nameWithTitle',
        },
        output: 'John Winston Ono Lennon MBE',
      },
      {
        name: 'uses custom options when specified as a string',
        props: {
          options: BEATLES_COMPLEX,
          filterOption: 'firstName',
          displayOption: 'nameWithTitle',
          formInputOption: 'lastName',
        },
        output: 'Lennon',
      },
      {
        name: 'uses custom optinos when specified as a function',
        props: {
          options: BEATLES_COMPLEX,
          filterOption: 'firstName',
          displayOption: 'nameWithTitle',
          formInputOption: (o: { firstName: string; lastName: string }) =>
            `${o.firstName} ${o.lastName}`,
        },
        output: 'John Lennon',
      },
    ];

    _.each(FORM_INPUT_TEST_PLANS, testplan => {
      test(testplan.name, () => {
        const component = mount(
          // @ts-ignore
          <Typeahead
            {...testplan.props}
            allowCustomValues={false}
            name="beatles"
          />
        );
        simulateTextInput(component, 'john');

        simulateKeyEvent(component, KeyEvent.DOM_VK_DOWN);
        simulateKeyEvent(component, KeyEvent.DOM_VK_RETURN);

        expect(component.find('input[type="hidden"]').prop('value')).toEqual(
          testplan.output
        );
      });
    });
  });
});
