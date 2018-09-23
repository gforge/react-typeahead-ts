/// <reference path="../node_modules/@types/jest/index.d.ts"/>.
import * as React from 'react';
// @ts-ignore
import { ReactWrapper } from 'jest';
import { mount } from 'enzyme';
import { Props as TProps } from '../src/typeahead';
import Tokenizer from '../src/tokenizer';
import Keyevent from '../src/keyevent';
import { Option } from '../src/types';

//  @ts-ignore
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
        <Tokenizer
          options={BEATLES}
        />);
    });

    test('Basic mount', () => {
      const ret = mount(
        <Tokenizer
          options={BEATLES}
        />);

      expect(ret.html()).toMatchSnapshot();
    });

    test('Complex mount', () => {
      const ret = mount(
        <Tokenizer
          options={BEATLES_COMPLEX}
        />);

      expect(ret.html()).toMatchSnapshot();
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
  });
});
