import * as React from 'react';
import _ from 'lodash';
import sinon from 'sinon';
import createReactClass from 'create-react-class';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import Typeahead from '../../src/Typeahead';
import TypeaheadOption from '../../src/Typeahead/TypeaheadOption';
import TypeaheadSelector from '../../src/Typeahead/TypeaheadSelector';
import Keyevent from '../../src/keyevent';

function simulateTextInput(component, value) {
  const node = component.refs.entry;
  node.value = value;
  TestUtils.Simulate.change(node);
  return TestUtils.scryRenderedComponentsWithType(component, TypeaheadOption);
}

describe('Typeahead Component', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let testContext: { [key: string]: any };

  beforeEach(() => {
    testContext = {};
  });

  // Prev. tests moved (sanity, props - sections)
  describe('props', () => {});

  describe('allowCustomValues', () => {
    beforeEach(() => {
      testContext.sinon = sinon.createSandbox();
      testContext.selectSpy = testContext.sinon.spy();
      testContext.component = mount(
        <Typeahead
          options={BEATLES}
          allowCustomValues
          onOptionSelected={testContext.selectSpy}
        />
      );
    });

    afterEach(() => {
      testContext.sinon.restore();
    });

    test('should not display custom value if input length is less than entered', () => {
      const input = testContext.component.refs.entry;
      input.value = 'zz';
      TestUtils.Simulate.change(input);
      const results = TestUtils.scryRenderedComponentsWithType(
        testContext.component,
        TypeaheadOption
      );
      expect(0).toEqual(results.length);
      expect(false).toEqual(testContext.selectSpy.called);
    });

    test('should display custom value if input exceeds props.allowCustomValues', () => {
      const input = testContext.component.refs.entry;
      input.value = 'ZZZ';
      TestUtils.Simulate.change(input);
      const results = TestUtils.scryRenderedComponentsWithType(
        testContext.component,
        TypeaheadOption
      );
      expect(1).toEqual(results.length);
      expect(false).toEqual(testContext.selectSpy.called);
    });

    test('should call onOptionSelected when selecting from options', () => {
      const results = simulateTextInput(testContext.component, 'o');
      const firstItem = ReactDOM.findDOMNode(results[0]).innerText;
      const node = testContext.component.refs.entry;
      simulateKeyEvent(node, Keyevent.DOM_VK_DOWN);
      simulateKeyEvent(node, Keyevent.DOM_VK_DOWN);
      simulateKeyEvent(node, Keyevent.DOM_VK_UP);
      simulateKeyEvent(node, Keyevent.DOM_VK_RETURN);

      expect(true).toEqual(testContext.selectSpy.called);
      expect(testContext.selectSpy.calledWith(firstItem)).toBeTruthy();
    });

    test('should call onOptionSelected when custom value is selected', () => {
      const input = testContext.component.refs.entry;
      input.value = 'ZZZ';
      TestUtils.Simulate.change(input);
      simulateKeyEvent(input, Keyevent.DOM_VK_DOWN);
      simulateKeyEvent(input, Keyevent.DOM_VK_RETURN);
      expect(true).toEqual(testContext.selectSpy.called);
      expect(testContext.selectSpy.calledWith(input.value)).toBeTruthy();
    });

    test('should add hover prop to customValue', () => {
      const input = testContext.component.refs.entry;
      input.value = 'ZZZ';
      TestUtils.Simulate.change(input);
      // tslint:disable-next-line:max-line-length
      const results = TestUtils.scryRenderedComponentsWithType(
        testContext.component,
        TypeaheadOption
      );
      simulateKeyEvent(input, Keyevent.DOM_VK_DOWN);
      expect(true).toEqual(results[0].props.hover);
    });
  });

  describe('customClasses', () => {
    beforeAll(() => {
      const customClasses = {
        input: 'topcoat-text-input',
        results: 'topcoat-list__container',
        listItem: 'topcoat-list__item',
        listAnchor: 'topcoat-list__link',
        hover: 'topcoat-list__item-active',
      };

      this.component = mount(
        <Typeahead options={BEATLES} customClasses={customClasses} />
      );

      simulateTextInput(this.component, 'o');
    });

    test('adds a custom class to the typeahead input', () => {
      const input = testContext.component.refs.entry;
      expect(input.classList.contains('topcoat-text-input')).toBe(true);
    });

    test('adds a custom class to the results component', () => {
      // eslint-disable-next-line react/no-find-dom-node
      const results = ReactDOM.findDOMNode(
        TestUtils.findRenderedComponentWithType(
          testContext.component,
          TypeaheadSelector
        )
      );
      expect(results.classList.contains('topcoat-list__container')).toBe(true);
    });

    test('adds a custom class to the list items', () => {
      // tslint:disable-next-line:max-line-length
      const typeaheadOptions = TestUtils.scryRenderedComponentsWithType(
        testContext.component,
        TypeaheadOption
      );
      const listItem = ReactDOM.findDOMNode(typeaheadOptions[1]);
      expect(listItem.classList.contains('topcoat-list__item')).toBe(true);
    });

    test('adds a custom class to the option anchor tags', () => {
      // tslint:disable-next-line:max-line-length
      const typeaheadOptions = TestUtils.scryRenderedComponentsWithType(
        testContext.component,
        TypeaheadOption
      );
      const listAnchor = typeaheadOptions[1].refs.anchor;
      expect(listAnchor.classList.contains('topcoat-list__link')).toBe(true);
    });

    test('adds a custom class to the list items when active', () => {
      // tslint:disable-next-line:max-line-length
      const typeaheadOptions = TestUtils.scryRenderedComponentsWithType(
        testContext.component,
        TypeaheadOption
      );
      const node = testContext.component.refs.entry;

      simulateKeyEvent(node, Keyevent.DOM_VK_DOWN);

      const listItem = typeaheadOptions[0];
      const domListItem = ReactDOM.findDOMNode(listItem);

      expect(domListItem.classList.contains('topcoat-list__item-active')).toBe(
        true
      );
    });
  });

  describe('initialValue', () => {
    test('should perform an initial search if a default value is provided', () => {
      const component = mount(<Typeahead options={BEATLES} initialValue="o" />);

      const results = TestUtils.scryRenderedComponentsWithType(
        component,
        TypeaheadOption
      );
      expect(results.length).toEqual(3);
    });
  });

  describe('value', () => {
    test('should set input value', () => {
      const component = mount(<Typeahead options={BEATLES} value="John" />);

      const input = component.refs.entry;
      expect(input.value).toEqual('John');
    });
  });

  describe('onKeyDown', () => {
    test('should bind to key events on the input', () => {
      const component = mount(
        <Typeahead
          options={BEATLES}
          onKeyDown={function(e) {
            expect(e.keyCode).toEqual(87);
          }}
        />
      );

      const input = component.refs.entry;
      TestUtils.Simulate.keyDown(input, { keyCode: 87 });
    });
  });

  describe('onKeyPress', () => {
    test('should bind to key events on the input', () => {
      const component = mount(
        <Typeahead
          options={BEATLES}
          onKeyPress={e => expect(e.keyCode).toEqual(87)}
        />
      );

      const input = component.refs.entry;
      TestUtils.Simulate.keyPress(input, { keyCode: 87 });
    });
  });

  describe('onKeyUp', () => {
    test('should bind to key events on the input', () => {
      const component = mount(
        <Typeahead
          options={BEATLES}
          onKeyUp={e => expect(e.keyCode).toEqual(87)}
        />
      );

      const input = component.refs.entry;
      TestUtils.Simulate.keyUp(input, { keyCode: 87 });
    });
  });

  describe('inputProps', () => {
    test('should forward props to the input element', () => {
      const component = mount(
        <Typeahead options={BEATLES} inputProps={{ autoCorrect: 'off' }} />
      );

      const input = component.refs.entry;
      expect(input.getAttribute('autoCorrect')).toEqual('off');
    });
  });

  describe('defaultClassNames', () => {
    test('should remove default classNames when this prop is specified and false', () => {
      const component = mount(
        <Typeahead options={BEATLES} defaultClassNames={false} />
      );
      simulateTextInput(component, 'o');

      expect(
        ReactDOM.findDOMNode(component).classList.contains('typeahead')
      ).toBeFalsy();
      expect(
        ReactDOM.findDOMNode(component.refs.sel).classList.contains(
          'typeahead-selector'
        )
      ).toBeFalsy();
    });
  });

  describe('customListComponent', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ListComponent: any;
    beforeAll(function() {
      ListComponent = createReactClass(() => <div />);
    });

    beforeEach(() => {
      testContext.component = mount(
        <Typeahead options={BEATLES} customListComponent={ListComponent} />
      );
    });

    test('should not show the customListComponent when the input is empty', () => {
      // tslint:disable-next-line:max-line-length
      const results = TestUtils.scryRenderedComponentsWithType(
        testContext.component,
        ListComponent
      );
      expect(0).toEqual(results.length);
    });

    test('should show the customListComponent when the input is not empty', () => {
      const input = testContext.component.refs.entry;
      input.value = 'o';
      TestUtils.Simulate.change(input);
      // tslint:disable-next-line:max-line-length
      const results = TestUtils.scryRenderedComponentsWithType(
        testContext.component,
        ListComponent
      );
      expect(1).toEqual(results.length);
    });

    // tslint:disable-next-line:max-line-length
    test('should no longer show the customListComponent after an option has been selected', () => {
      const input = testContext.component.refs.entry;
      input.value = 'o';
      TestUtils.Simulate.change(input);
      simulateKeyEvent(input, Keyevent.DOM_VK_TAB);
      // tslint:disable-next-line:max-line-length
      const results = TestUtils.scryRenderedComponentsWithType(
        testContext.component,
        ListComponent
      );
      expect(0).toEqual(results.length);
    });
  });

  describe('textarea', () => {
    test('should render a <textarea> input', () => {
      const component = mount(<Typeahead options={BEATLES} textarea />);

      const input = component.refs.entry;
      expect(input.tagName.toLowerCase()).toEqual('textarea');
    });

    test('should render a <input> input', () => {
      const component = mount(<Typeahead options={BEATLES} />);

      const input = component.refs.entry;
      expect(input.tagName.toLowerCase()).toEqual('input');
    });
  });

  describe('showOptionsWhenEmpty', () => {
    test('do not render options when value is empty by default', () => {
      const component = mount(<Typeahead options={BEATLES} />);

      const results = TestUtils.scryRenderedComponentsWithType(
        component,
        TypeaheadOption
      );
      expect(0).toEqual(results.length);
    });

    test('do not render options when value is empty when set to true and not focused', () => {
      const component = mount(
        <Typeahead options={BEATLES} showOptionsWhenEmpty />
      );

      const results = TestUtils.scryRenderedComponentsWithType(
        component,
        TypeaheadOption
      );
      expect(0).toEqual(results.length);
    });

    test('render options when value is empty when set to true and focused', () => {
      const component = mount(
        <Typeahead options={BEATLES} showOptionsWhenEmpty />
      );

      TestUtils.Simulate.focus(component.refs.entry);
      const results = TestUtils.scryRenderedComponentsWithType(
        component,
        TypeaheadOption
      );
      expect(4).toEqual(results.length);
    });
  });
});
