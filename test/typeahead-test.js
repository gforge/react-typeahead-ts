import _ from 'lodash';
import sinon from 'sinon';
import * as React from 'react';
import ReactDOM from 'react-dom';
import Typeahead from '../src/typeahead';
import TypeaheadOption from '../src/typeahead/option';
import TypeaheadSelector from '../src/typeahead/selector';
import Keyevent from '../src/keyevent';
import TestUtils from 'react-dom/test-utils';
import createReactClass from 'create-react-class';

function simulateTextInput(component, value) {
  var node = component.refs.entry;
  node.value = value;
  TestUtils.Simulate.change(node);
  return TestUtils.scryRenderedComponentsWithType(component, TypeaheadOption);
}

var BEATLES = ['John', 'Paul', 'George', 'Ringo'];

var BEATLES_COMPLEX = [
  {
    firstName: 'John',
    lastName: 'Lennon',
    nameWithTitle: 'John Winston Ono Lennon MBE'
  }, {
    firstName: 'Paul',
    lastName: 'McCartney',
    nameWithTitle: 'Sir James Paul McCartney MBE'
  }, {
    firstName: 'George',
    lastName: 'Harrison',
    nameWithTitle: 'George Harrison MBE'
  }, {
    firstName: 'Ringo',
    lastName: 'Starr',
    nameWithTitle: 'Richard Starkey Jr. MBE'
  }
];

describe('Typeahead Component', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  describe('sanity', () => {
    beforeEach(() => {
      testContext.component = TestUtils.renderIntoDocument(<Typeahead options={
        BEATLES
      } />);
    });

    test('should fuzzy search and render matching results', () => {
      // input value: num of expected results
      var testplan = {
        'o': 3,
        'pa': 1,
        'Grg': 1,
        'Ringo': 1,
        'xxx': 0
      };

      _.each(testplan, function(expected, value) {
        var results = simulateTextInput(testContext.component, value);
        expect(results.length).toEqual(expected);
      }, this);
    });

    test('does not change the url hash when clicking on options', () => {
      var results = simulateTextInput(testContext.component, 'o');
      var firstResult = results[0];
      var anchor = TestUtils.findRenderedDOMComponentWithTag(firstResult, 'a');
      var href = ReactDOM.findDOMNode(anchor).getAttribute('href');
      expect(href).not.toEqual('#');
    });

    describe('keyboard controls', () => {
      test('down arrow + return selects an option', () => {
        var results = simulateTextInput(testContext.component, 'o');
        var secondItem = ReactDOM.findDOMNode(results[1]).innerText;
        var node = testContext.component.refs.entry;
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_DOWN });
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_DOWN });
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_RETURN });
        expect(node.value).toEqual(secondItem); // Poor Ringo
      });

      test('up arrow + return navigates and selects an option', () => {
        var results = simulateTextInput(testContext.component, 'o');
        var firstItem = ReactDOM.findDOMNode(results[0]).innerText;
        var node = testContext.component.refs.entry;
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_DOWN });
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_DOWN });
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_UP });
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_RETURN });
        expect(node.value).toEqual(firstItem);
      });

      test('escape clears selection', () => {
        var results = simulateTextInput(testContext.component, 'o');
        var firstItem = ReactDOM.findDOMNode(results[0]);
        var node = testContext.component.refs.entry;
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_DOWN });
        expect(firstItem.classList.contains('hover')).toBeTruthy();
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_ESCAPE });
        expect(firstItem.classList.contains('hover')).toBeFalsy();
      });

      test('tab to choose first item', () => {
        var results = simulateTextInput(testContext.component, 'o');
        var itemText = ReactDOM.findDOMNode(results[0]).innerText;
        var node = testContext.component.refs.entry;
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_TAB });
        expect(node.value).toEqual(itemText);
      });

      test('tab to selected current item', () => {
        var results = simulateTextInput(testContext.component, 'o');
        var itemText = ReactDOM.findDOMNode(results[1]).innerText;
        var node = testContext.component.refs.entry;
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_DOWN });
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_DOWN });
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_TAB });
        expect(node.value).toEqual(itemText);
      });

      test('tab on no selection should not be undefined', () => {
        var results = simulateTextInput(testContext.component, 'oz');
        expect(results.length == 0).toBeTruthy();
        var node = testContext.component.refs.entry;
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_TAB });
        expect("oz").toEqual(node.value);
      });

      test('should set hover', () => {
        var results = simulateTextInput(testContext.component, 'o');
        var node = testContext.component.refs.entry;
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_DOWN });
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_DOWN });
        expect(true).toEqual(results[1].props.hover);
      });
    });

    describe('mouse controls', () => {
      // as of React 15.5.4 this does not work
      xit('mouse click selects an option (click event)', function() {
        var results = simulateTextInput(this.component, 'o');
        var secondItem = ReactDOM.findDOMNode(results[1]);
        var secondItemValue = secondItem.innerText;
        var node = this.component.refs.entry;
        TestUtils.Simulate.click(secondItem);
        expect(node.value).toEqual(secondItemValue);
      });
      // but this one works
      test('mouse click selects an option (mouseDown event)', () => {
        var results = simulateTextInput(testContext.component, 'o');
        var secondItem = ReactDOM.findDOMNode(results[1]);
        var secondItemValue = secondItem.innerText;
        var node = testContext.component.refs.entry;
        TestUtils.Simulate.mouseDown(secondItem);
        expect(node.value).toEqual(secondItemValue);
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
        var node = ReactDOM.findDOMNode(testContext.component.refs.entry);
        testContext.sinon.spy(node, 'focus');
        testContext.component.focus();
        expect(node.focus.calledOnce).toEqual(true);
      });
    });
  });

  describe('props', () => {
    describe('maxVisible', () => {
      test('limits the result set based on the maxVisible option', () => {
        var component = TestUtils.renderIntoDocument(<Typeahead
          options={ BEATLES }
          maxVisible={ 1 }
          ></Typeahead>);
        var results = simulateTextInput(component, 'o');
        expect(results.length).toEqual(1);
      });

      test(
        'limits the result set based on the maxVisible option, and shows resultsTruncatedMessage when specified',
        () => {
          var component = TestUtils.renderIntoDocument(<Typeahead
            options={ BEATLES }
            maxVisible={ 1 }
            resultsTruncatedMessage='Results truncated'
            ></Typeahead>);
          var results = simulateTextInput(component, 'o');
          expect(
            TestUtils.findRenderedDOMComponentWithClass(component, 'results-truncated').textContent
          ).toEqual('Results truncated');
        }
      );
    });

    describe('displayOption', () => {
      test('renders simple options verbatim when not specified', () => {
        var component = TestUtils.renderIntoDocument(<Typeahead
          options={ BEATLES }
        />);
        var results = simulateTextInput(component, 'john');
        expect(ReactDOM.findDOMNode(results[0]).textContent).toEqual('John');
      });

      test('renders custom options when specified as a string', () => {
        var component = TestUtils.renderIntoDocument(<Typeahead
          options={ BEATLES_COMPLEX }
          filterOption='firstName'
          displayOption='nameWithTitle'
        />);
        var results = simulateTextInput(component, 'john');
        expect(ReactDOM.findDOMNode(results[0]).textContent).toEqual('John Winston Ono Lennon MBE');
      });

      test('renders custom options when specified as a function', () => {
        var component = TestUtils.renderIntoDocument(<Typeahead
          options={ BEATLES_COMPLEX }
          filterOption='firstName'
          displayOption={ function(o, i) { return i + ' ' + o.firstName + ' ' + o.lastName; } }
        />);
        var results = simulateTextInput(component, 'john');
        expect(ReactDOM.findDOMNode(results[0]).textContent).toEqual('0 John Lennon');
      });
    });

    describe('searchOptions', () => {
      test('maps correctly when specified with map function', () => {
        var createObject = function(o) {
          return { len: o.length, orig: o };
        };

        var component = TestUtils.renderIntoDocument(<Typeahead
          options={ BEATLES }
          searchOptions={ function(inp, opts) { return opts.map(createObject); } }
          displayOption={ function(o, i) { return 'Score: ' + o.len + ' ' + o.orig; } }
          inputDisplayOption={ function(o, i) { return o.orig; } }
        />);

        var results = simulateTextInput(component, 'john');
        expect(ReactDOM.findDOMNode(results[0]).textContent).toEqual('Score: 4 John');
      });

      test(
        'can sort displayed items when specified with map function wrapped with sort',
        () => {
          var createObject = function(o) {
            return { len: o.length, orig: o };
          };

          var component = TestUtils.renderIntoDocument(<Typeahead
            options={ BEATLES }
            searchOptions={ function(inp, opts) { return opts.map(function(o) { return o; }).sort().map(createObject); } }
            displayOption={ function(o, i) { return 'Score: ' + o.len + ' ' + o.orig; } }
            inputDisplayOption={ function(o, i) { return o.orig; } }
          />);

          var results = simulateTextInput(component, 'john');
          expect(ReactDOM.findDOMNode(results[0]).textContent).toEqual('Score: 6 George');
        }
      );
    });

    describe('inputDisplayOption', () => {
      test(
        'displays a different value in input field and in list display',
        () => {
          var createObject = function(o) {
            return { len: o.length, orig: o };
          };

          var component = TestUtils.renderIntoDocument(<Typeahead
            options={ BEATLES }
            searchOptions={ function(inp, opts) { return opts.map(function(o) { return o; }).sort().map(createObject); } }
            displayOption={ function(o, i) { return 'Score: ' + o.len + ' ' + o.orig; } }
            inputDisplayOption={ function(o, i) { return o.orig; } }
          />);

          var results = simulateTextInput(component, 'john');
          var node = component.refs.entry;
          TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_TAB });

          expect(node.value).toEqual('George');
        }
      );
    });

    describe('allowCustomValues', () => {

      beforeEach(() => {
        testContext.sinon = sinon.sandbox.create()
        testContext.selectSpy = testContext.sinon.spy();
        testContext.component = TestUtils.renderIntoDocument(<Typeahead
          options={BEATLES}
          allowCustomValues={3}
          onOptionSelected={testContext.selectSpy}
          ></Typeahead>);
      });

      afterEach(() => {
        testContext.sinon.restore();
      })

      test(
        'should not display custom value if input length is less than entered',
        () => {
          var input = testContext.component.refs.entry;
          input.value = "zz";
          TestUtils.Simulate.change(input);
          var results = TestUtils.scryRenderedComponentsWithType(testContext.component, TypeaheadOption);
          expect(0).toEqual(results.length);
          expect(false).toEqual(testContext.selectSpy.called);
        }
      );

      test(
        'should display custom value if input exceeds props.allowCustomValues',
        () => {
          var input = testContext.component.refs.entry;
          input.value = "ZZZ";
          TestUtils.Simulate.change(input);
          var results = TestUtils.scryRenderedComponentsWithType(testContext.component, TypeaheadOption);
          expect(1).toEqual(results.length);
          expect(false).toEqual(testContext.selectSpy.called);
        }
      );

      test('should call onOptionSelected when selecting from options', () => {
        var results = simulateTextInput(testContext.component, 'o');
        var firstItem = ReactDOM.findDOMNode(results[0]).innerText;
        var node = testContext.component.refs.entry;
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_DOWN });
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_DOWN });
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_UP });
        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_RETURN });

        expect(true).toEqual(testContext.selectSpy.called);
        expect(testContext.selectSpy.calledWith(firstItem)).toBeTruthy();
      })

      test('should call onOptionSelected when custom value is selected', () => {
        var input = testContext.component.refs.entry;
        input.value = "ZZZ";
        TestUtils.Simulate.change(input);
        TestUtils.Simulate.keyDown(input, { keyCode: Keyevent.DOM_VK_DOWN });
        TestUtils.Simulate.keyDown(input, { keyCode: Keyevent.DOM_VK_RETURN });
        expect(true).toEqual(testContext.selectSpy.called);
        expect(testContext.selectSpy.calledWith(input.value)).toBeTruthy();
      })

      test('should add hover prop to customValue', () => {
        var input = testContext.component.refs.entry;
        input.value = "ZZZ";
        TestUtils.Simulate.change(input);
        var results = TestUtils.scryRenderedComponentsWithType(testContext.component, TypeaheadOption);
        TestUtils.Simulate.keyDown(input, { keyCode: Keyevent.DOM_VK_DOWN });
        expect(true).toEqual(results[0].props.hover)
      })


    });

    describe('customClasses', () => {

      beforeAll(function() {
        var customClasses = {
          input: 'topcoat-text-input',
          results: 'topcoat-list__container',
          listItem: 'topcoat-list__item',
          listAnchor: 'topcoat-list__link',
          hover: 'topcoat-list__item-active'
        };

        this.component = TestUtils.renderIntoDocument(<Typeahead
          options={ BEATLES }
          customClasses={ customClasses }
        ></Typeahead>);

        simulateTextInput(this.component, 'o');
      });

      test('adds a custom class to the typeahead input', () => {
        var input = testContext.component.refs.entry;
        expect(input.classList.contains('topcoat-text-input')).toBe(true);
      });

      test('adds a custom class to the results component', () => {
        var results = ReactDOM.findDOMNode(TestUtils.findRenderedComponentWithType(testContext.component, TypeaheadSelector));
        expect(results.classList.contains('topcoat-list__container')).toBe(true);
      });

      test('adds a custom class to the list items', () => {
        var typeaheadOptions = TestUtils.scryRenderedComponentsWithType(testContext.component, TypeaheadOption);
        var listItem = ReactDOM.findDOMNode(typeaheadOptions[1]);
        expect(listItem.classList.contains('topcoat-list__item')).toBe(true);
      });

      test('adds a custom class to the option anchor tags', () => {
        var typeaheadOptions = TestUtils.scryRenderedComponentsWithType(testContext.component, TypeaheadOption);
        var listAnchor = typeaheadOptions[1].refs.anchor;
        expect(listAnchor.classList.contains('topcoat-list__link')).toBe(true);
      });

      test('adds a custom class to the list items when active', () => {
        var typeaheadOptions = TestUtils.scryRenderedComponentsWithType(testContext.component, TypeaheadOption);
        var node = testContext.component.refs.entry;

        TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_DOWN });

        var listItem = typeaheadOptions[0];
        var domListItem = ReactDOM.findDOMNode(listItem);

        expect(domListItem.classList.contains('topcoat-list__item-active')).toBe(true);
      });
    });

    describe('initialValue', () => {
      test(
        'should perform an initial search if a default value is provided',
        () => {
          var component = TestUtils.renderIntoDocument(<Typeahead
            options={ BEATLES }
            initialValue={ 'o' }
          />);

          var results = TestUtils.scryRenderedComponentsWithType(component, TypeaheadOption);
          expect(results.length).toEqual(3);
        }
      );
    });

    describe('value', () => {
      test('should set input value', () => {
        var component = TestUtils.renderIntoDocument(<Typeahead
          options={ BEATLES }
          value={ 'John' }
        />);

        var input = component.refs.entry;
        expect(input.value).toEqual('John');
      });
    });

    describe('onKeyDown', () => {
      test('should bind to key events on the input', () => {
        var component = TestUtils.renderIntoDocument(<Typeahead
          options={ BEATLES }
          onKeyDown={ function(e) {
              expect(e.keyCode).toEqual(87);
            }
          }
        />);

        var input = component.refs.entry;
        TestUtils.Simulate.keyDown(input, { keyCode: 87 });
      });
    });

    describe('onKeyPress', () => {
      test('should bind to key events on the input', () => {
        var component = TestUtils.renderIntoDocument(<Typeahead
          options={ BEATLES }
          onKeyPress={ function(e) {
              expect(e.keyCode).toEqual(87);
            }
          }
        />);

        var input = component.refs.entry;
        TestUtils.Simulate.keyPress(input, { keyCode: 87 });
      });
    });

    describe('onKeyUp', () => {
      test('should bind to key events on the input', () => {
        var component = TestUtils.renderIntoDocument(<Typeahead
          options={ BEATLES }
          onKeyUp={ function(e) {
              expect(e.keyCode).toEqual(87);
            }
          }
        />);

        var input = component.refs.entry;
        TestUtils.Simulate.keyUp(input, { keyCode: 87 });
      });
    });

    describe('inputProps', () => {
      test('should forward props to the input element', () => {
        var component = TestUtils.renderIntoDocument(<Typeahead
          options={ BEATLES }
          inputProps={{ autoCorrect: 'off' }}
        />);

        var input = component.refs.entry;
        expect(input.getAttribute('autoCorrect')).toEqual('off');
      });
    });

    describe('defaultClassNames', () => {
      test(
        'should remove default classNames when this prop is specified and false',
        () => {
          var component = TestUtils.renderIntoDocument(<Typeahead
            options={ BEATLES }
            defaultClassNames={false}
          />);
          simulateTextInput(component, 'o');

          expect(ReactDOM.findDOMNode(component).classList.contains("typeahead")).toBeFalsy();
          expect(
            ReactDOM.findDOMNode(component.refs.sel).classList.contains("typeahead-selector")
          ).toBeFalsy();
        }
      );
    });

    describe('filterOption', () => {
      var FN_TEST_PLANS = [
        {
          name: 'accepts everything',
          fn: function() { return true; },
          input: 'xxx',
          output: 4
        }, {
          name: 'rejects everything',
          fn: function() { return false; },
          input: 'o',
          output: 0
        }
      ];

      _.each(FN_TEST_PLANS, function(testplan) {
        test('should filter with a custom function that ' + testplan.name, () => {
          var component = TestUtils.renderIntoDocument(<Typeahead
            options={ BEATLES }
            filterOption={ testplan.fn }
          />);

          var results = simulateTextInput(component, testplan.input);
          expect(results.length).toEqual(testplan.output);
        });
      });

      var STRING_TEST_PLANS = {
        'o': 3,
        'pa': 1,
        'Grg': 1,
        'Ringo': 1,
        'xxx': 0
      };

      test(
        'should filter using fuzzy matching on the provided field name',
        () => {
          var component = TestUtils.renderIntoDocument(<Typeahead
            options={ BEATLES_COMPLEX }
            filterOption='firstName'
            displayOption='firstName'
          />);

          _.each(STRING_TEST_PLANS, function(expected, value) {
            var results = simulateTextInput(component, value);
            expect(results.length).toEqual(expected);
          }, this);
        }
      );
    });

    describe('formInputOption', () => {
      var FORM_INPUT_TEST_PLANS = [
        {
          name: 'uses simple options verbatim when not specified',
          props: {
            options: BEATLES
          },
          output: 'John'
        }, {
          name: 'defaults to the display string when not specified',
          props: {
            options: BEATLES_COMPLEX,
            filterOption: 'firstName',
            displayOption: 'nameWithTitle'
          },
          output: 'John Winston Ono Lennon MBE'
        }, {
          name: 'uses custom options when specified as a string',
          props: {
            options: BEATLES_COMPLEX,
            filterOption: 'firstName',
            displayOption: 'nameWithTitle',
            formInputOption: 'lastName'
          },
          output: 'Lennon'
        }, {
          name: 'uses custom optinos when specified as a function',
          props: {
            options: BEATLES_COMPLEX,
            filterOption: 'firstName',
            displayOption: 'nameWithTitle',
            formInputOption: function(o, i) { return o.firstName + ' ' + o.lastName; }
          },
          output: 'John Lennon'
        }
      ];

      _.each(FORM_INPUT_TEST_PLANS, function(testplan) {
        test(testplan.name, () => {
          var component = TestUtils.renderIntoDocument(<Typeahead
            {...testplan.props}
            name='beatles'
          />);
          var results = simulateTextInput(component, 'john');

          var node = component.refs.entry;
          TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_DOWN });
          TestUtils.Simulate.keyDown(node, { keyCode: Keyevent.DOM_VK_RETURN });

          expect(component.state.selection).toEqual(testplan.output);
        });
      });
    });

    describe('customListComponent', () => {
      beforeAll(function() {
        ListComponent = createReactClass({
          render: function() {
            return <div></div>;
          }
        });

        this.ListComponent = ListComponent;
      })

      beforeEach(() => {

        testContext.component = TestUtils.renderIntoDocument(
          <Typeahead
            options={ BEATLES }
            customListComponent={testContext.ListComponent}/>
        );
      });

      test(
        'should not show the customListComponent when the input is empty',
        () => {
          var results = TestUtils.scryRenderedComponentsWithType(testContext.component, testContext.ListComponent);
          expect(0).toEqual(results.length);
        }
      );

      test(
        'should show the customListComponent when the input is not empty',
        () => {
          var input = testContext.component.refs.entry;
          input.value = "o";
          TestUtils.Simulate.change(input);
          var results = TestUtils.scryRenderedComponentsWithType(testContext.component, testContext.ListComponent);
          expect(1).toEqual(results.length);
        }
      );

      test(
        'should no longer show the customListComponent after an option has been selected',
        () => {
          var input = testContext.component.refs.entry;
          input.value = "o";
          TestUtils.Simulate.change(input);
          TestUtils.Simulate.keyDown(input, { keyCode: Keyevent.DOM_VK_TAB });
          var results = TestUtils.scryRenderedComponentsWithType(testContext.component, testContext.ListComponent);
          expect(0).toEqual(results.length);
        }
      );
    });

    describe('textarea', () => {
      test('should render a <textarea> input', () => {
        var component = TestUtils.renderIntoDocument(<Typeahead
          options={ BEATLES }
          textarea={ true }
        />);

        var input = component.refs.entry;
        expect(input.tagName.toLowerCase()).toEqual('textarea');
      });

      test('should render a <input> input', () => {
        var component = TestUtils.renderIntoDocument(<Typeahead
          options={ BEATLES }
        />);

        var input = component.refs.entry;
        expect(input.tagName.toLowerCase()).toEqual('input');
      });
    });

    describe('showOptionsWhenEmpty', () => {
      test('do not render options when value is empty by default', () => {
        var component = TestUtils.renderIntoDocument(
          <Typeahead
            options={ BEATLES }
          />
        );

        var results = TestUtils.scryRenderedComponentsWithType(component, TypeaheadOption);
        expect(0).toEqual(results.length);
      });

      test(
        'do not render options when value is empty when set to true and not focused',
        () => {
          var component = TestUtils.renderIntoDocument(
            <Typeahead
              options={ BEATLES }
              showOptionsWhenEmpty={ true }
            />
          );

          var results = TestUtils.scryRenderedComponentsWithType(component, TypeaheadOption);
          expect(0).toEqual(results.length);
        }
      );

      test(
        'render options when value is empty when set to true and focused',
        () => {
          var component = TestUtils.renderIntoDocument(
            <Typeahead
              options={ BEATLES }
              showOptionsWhenEmpty={ true }
            />
          );

          TestUtils.Simulate.focus(component.refs.entry);
          var results = TestUtils.scryRenderedComponentsWithType(component, TypeaheadOption);
          expect(4).toEqual(results.length);
        }
      );
    });
  });
});
