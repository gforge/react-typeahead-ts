import * as React from 'react';
import { mount } from 'enzyme';
import Typeahead from '../../src/Typeahead';
import simulateTextInput from '../helpers/simulateTextInput';
import { BEATLES, BEATLES_COMPLEX } from '../helpers/data';

describe('Typeahead Component props maxVisible', () => {
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
