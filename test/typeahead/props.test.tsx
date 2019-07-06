import * as React from 'react';
import { mount } from 'enzyme';
import Typeahead from '../../src/Typeahead';
import { OptionsObject } from '../../src/types';
import simulateTextInput from '../helpers/simulateTextInput';

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

describe('Typeahead Component props', () => {
  describe('maxVisible', () => {
    test('limits the result set based on the maxVisible option', () => {
      let component = mount(<Typeahead options={BEATLES} maxVisible={1} />);

      simulateTextInput(component, 'o');
      expect(component.find('button.typeahead-option').length).toEqual(1);

      component = mount(<Typeahead options={BEATLES} maxVisible={2} />);

      simulateTextInput(component, 'o');
      expect(component.find('button.typeahead-option').length).toEqual(2);
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
