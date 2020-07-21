import * as React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import Typeahead from '../../src/Typeahead';
import simulateTextInput from '../helpers/simulateTextInput';
import simulateKeyEvent from '../helpers/simulateKeyEvent';
import { BEATLES } from '../helpers/data';
import Keyevent from '../../src/keyevent';

describe('Typeahead Component props allowCustomValue', () => {
  test('Should display the custom value that can be selected', () => {
    const sinonBox = sinon.createSandbox();
    const selectSpy = sinonBox.spy();

    const component = mount(
      <Typeahead
        options={BEATLES}
        allowCustomValues
        onOptionSelected={selectSpy}
      />
    );

    simulateTextInput(component, 'a');
    expect(false).toEqual(selectSpy.called);
    expect(component.find('li').map((n) => n.text())).toEqual(['a', 'Paul']);
    simulateKeyEvent(component, Keyevent.DOM_VK_TAB);

    expect(component.find('input[type="text"]').props().value).toEqual('a');
    expect(true).toEqual(selectSpy.called);
    expect(selectSpy.args[0][0]).toEqual('a');
  });
});

describe('Typeahead Component props allowCustomValue when separateByComma = true', () => {
  test('Should display the custom value that can be selected', () => {
    const sinonBox = sinon.createSandbox();
    const selectSpy = sinonBox.spy();

    const component = mount(
      <Typeahead
        options={BEATLES}
        allowCustomValues
        separateByComma
        onOptionSelected={selectSpy}
      />
    );

    simulateTextInput(component, 'a');
    expect(false).toEqual(selectSpy.called);
    expect(component.find('li').map((n) => n.text())).toEqual(['a', 'Paul']);
    simulateKeyEvent(component, Keyevent.DOM_VK_COMMA);

    expect(component.find('input[type="text"]').props().value).toEqual('a');
    expect(true).toEqual(selectSpy.called);
    expect(selectSpy.args[0][0]).toEqual('a');
  });
});
