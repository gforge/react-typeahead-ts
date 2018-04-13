(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('react'), require('reactstrap')) :
    typeof define === 'function' && define.amd ? define(['exports', 'tslib', 'react', 'reactstrap'], factory) :
    (factory((global.FormikAdminTaskType = {}),global.tslib,global.React,global.reactstrap));
}(this, (function (exports,tslib_1,React,reactstrap) { 'use strict';

    var Accessor = (function () {
        function Accessor() {
        }
        Accessor.IDENTITY_FN = function (input) { return input; };
        Accessor.generateAccessor = function (field) {
            return function (object) { return object[field]; };
        };
        Accessor.generateOptionToStringFor = function (prop) {
            if (typeof prop === 'string') {
                return Accessor.generateAccessor(prop);
            }
            if (typeof prop === 'function') {
                return prop;
            }
            return Accessor.IDENTITY_FN;
        };
        Accessor.valueForOption = function (option, object) {
            if (typeof option === 'string') {
                if (typeof object !== 'object')
                    throw new Error("Invalid object type " + typeof object);
                return object[option];
            }
            if (typeof option === 'function') {
                return option(object);
            }
            if (typeof object === 'string') {
                return object;
            }
            throw new Error("Invalid object type " + typeof object);
        };
        return Accessor;
    }());

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var classnames = createCommonjsModule(function (module) {
    /*!
      Copyright (c) 2016 Jed Watson.
      Licensed under the MIT License (MIT), see
      http://jedwatson.github.io/classnames
    */
    /* global define */

    (function () {

    	var hasOwn = {}.hasOwnProperty;

    	function classNames () {
    		var classes = [];

    		for (var i = 0; i < arguments.length; i++) {
    			var arg = arguments[i];
    			if (!arg) continue;

    			var argType = typeof arg;

    			if (argType === 'string' || argType === 'number') {
    				classes.push(arg);
    			} else if (Array.isArray(arg)) {
    				classes.push(classNames.apply(null, arg));
    			} else if (argType === 'object') {
    				for (var key in arg) {
    					if (hasOwn.call(arg, key) && arg[key]) {
    						classes.push(key);
    					}
    				}
    			}
    		}

    		return classes.join(' ');
    	}

    	if ('object' !== 'undefined' && module.exports) {
    		module.exports = classNames;
    	} else if (typeof undefined === 'function' && typeof undefined.amd === 'object' && undefined.amd) {
    		// register as 'classnames', consistent with npm package name
    		undefined('classnames', [], function () {
    			return classNames;
    		});
    	} else {
    		window.classNames = classNames;
    	}
    }());
    });

    var TypeaheadOption = (function (_super) {
        tslib_1.__extends(TypeaheadOption, _super);
        function TypeaheadOption(props) {
            var _this = _super.call(this, props) || this;
            _this.onClick = _this.onClick.bind(_this);
            return _this;
        }
        TypeaheadOption.prototype.getDefaultProps = function () {
            var customClasses = { hover: 'hover' };
            return {
                customClasses: customClasses,
                onClick: function (event) {
                    event.preventDefault();
                },
                hover: false,
            };
        };
        TypeaheadOption.prototype.render = function () {
            var _a = tslib_1.__assign({}, this.getDefaultProps(), this.props), customClasses = _a.customClasses, hover = _a.hover, children = _a.children, customValue = _a.customValue;
            var classes = {};
            var listItem = customClasses.listItem, _b = customClasses.hover, hoverClass = _b === void 0 ? 'hover' : _b, customAdd = customClasses.customAdd;
            classes[hoverClass] = Boolean(hover);
            if (listItem) {
                classes[listItem] = Boolean(listItem);
            }
            if (customValue && customAdd) {
                classes[customAdd] = Boolean(customAdd);
            }
            var classList = classnames(classes);
            return (React.createElement("li", { className: classList, onClick: this.onClick, onMouseDown: this.onClick },
                React.createElement("a", { href: "javascript: void 0;", className: this.getClasses(), ref: "anchor" }, children)));
        };
        TypeaheadOption.prototype.getClasses = function () {
            var customClasses = tslib_1.__assign({}, this.getDefaultProps(), this.props).customClasses;
            var classes = {
                'typeahead-option': true,
            };
            var listAnchor = customClasses.listAnchor;
            if (listAnchor) {
                classes[listAnchor] = true;
            }
            return classnames(classes);
        };
        TypeaheadOption.prototype.onClick = function (event) {
            event.preventDefault();
            return this.props.onClick(event);
        };
        return TypeaheadOption;
    }(React.Component));

    var TypeaheadSelector = (function (_super) {
        tslib_1.__extends(TypeaheadSelector, _super);
        function TypeaheadSelector() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TypeaheadSelector.prototype.getDefaultProps = function () {
            var customClasses = {};
            return {
                customClasses: customClasses,
                allowCustomValues: 0,
                onOptionSelected: function () { },
                defaultClassNames: true,
            };
        };
        TypeaheadSelector.prototype.render = function () {
            var _this = this;
            var _a = tslib_1.__assign({}, this.getDefaultProps(), this.props), options = _a.options, customClasses = _a.customClasses, customValue = _a.customValue, displayOption = _a.displayOption, defaultClassNames = _a.defaultClassNames, allowCustomValues = _a.allowCustomValues, selectionIndex = _a.selectionIndex, areResultsTruncated = _a.areResultsTruncated, resultsTruncatedMessage = _a.resultsTruncatedMessage;
            if (!options.length && allowCustomValues <= 0) {
                return false;
            }
            var classes = {
                'typeahead-selector': defaultClassNames,
            };
            var resClass = customClasses.results;
            if (resClass) {
                classes[resClass] = true;
            }
            var classList = classnames(classes);
            var customValueComponent;
            var customValueOffset = 0;
            if (customValue) {
                customValueOffset += 1;
                customValueComponent = (React.createElement(TypeaheadOption, { ref: customValue, key: customValue, hover: selectionIndex === 0, customClasses: customClasses, customValue: customValue, onClick: this.onClick.bind(this, customValue) }, customValue));
            }
            var results = options.map(function (result, i) {
                var displayString = displayOption(result, i);
                var uniqueKey = displayString + '_' + i;
                return (React.createElement(TypeaheadOption, { ref: uniqueKey, key: uniqueKey, hover: selectionIndex === i + customValueOffset, customClasses: customClasses, onClick: _this.onClick.bind(_this, result) }, displayString));
            });
            if (areResultsTruncated && resultsTruncatedMessage) {
                var resultsTruncatedClasses = {
                    'results-truncated': defaultClassNames,
                };
                var resultsTruncated = customClasses.resultsTruncated;
                if (resultsTruncated) {
                    resultsTruncatedClasses[resultsTruncated] = true;
                }
                var resultsTruncatedClassList = classnames(resultsTruncatedClasses);
                results.push(React.createElement("li", { key: "results-truncated", className: resultsTruncatedClassList }, this.props.resultsTruncatedMessage));
            }
            return (React.createElement("ul", { className: classList },
                customValueComponent,
                results));
        };
        TypeaheadSelector.prototype.onClick = function (result, event) {
            var onOptionSelected = this.props.onOptionSelected;
            if (!onOptionSelected)
                return;
            return onOptionSelected(result, event);
        };
        return TypeaheadSelector;
    }(React.Component));

    var KeyEvent = KeyEvent || {};
    KeyEvent.DOM_VK_UP = KeyEvent.DOM_VK_UP || 38;
    KeyEvent.DOM_VK_DOWN = KeyEvent.DOM_VK_DOWN || 40;
    KeyEvent.DOM_VK_BACK_SPACE = KeyEvent.DOM_VK_BACK_SPACE || 8;
    KeyEvent.DOM_VK_RETURN = KeyEvent.DOM_VK_RETURN || 13;
    KeyEvent.DOM_VK_ENTER = KeyEvent.DOM_VK_ENTER || 14;
    KeyEvent.DOM_VK_ESCAPE = KeyEvent.DOM_VK_ESCAPE || 27;
    KeyEvent.DOM_VK_TAB = KeyEvent.DOM_VK_TAB || 9;

    var fuzzy = createCommonjsModule(function (module, exports) {
    /*
     * Fuzzy
     * https://github.com/myork/fuzzy
     *
     * Copyright (c) 2012 Matt York
     * Licensed under the MIT license.
     */

    (function() {

    var fuzzy = {};

    // Use in node or in browser
    {
      module.exports = fuzzy;
    }

    // Return all elements of `array` that have a fuzzy
    // match against `pattern`.
    fuzzy.simpleFilter = function(pattern, array) {
      return array.filter(function(str) {
        return fuzzy.test(pattern, str);
      });
    };

    // Does `pattern` fuzzy match `str`?
    fuzzy.test = function(pattern, str) {
      return fuzzy.match(pattern, str) !== null;
    };

    // If `pattern` matches `str`, wrap each matching character
    // in `opts.pre` and `opts.post`. If no match, return null
    fuzzy.match = function(pattern, str, opts) {
      opts = opts || {};
      var patternIdx = 0
        , result = []
        , len = str.length
        , totalScore = 0
        , currScore = 0
        // prefix
        , pre = opts.pre || ''
        // suffix
        , post = opts.post || ''
        // String to compare against. This might be a lowercase version of the
        // raw string
        , compareString =  opts.caseSensitive && str || str.toLowerCase()
        , ch;

      pattern = opts.caseSensitive && pattern || pattern.toLowerCase();

      // For each character in the string, either add it to the result
      // or wrap in template if it's the next string in the pattern
      for(var idx = 0; idx < len; idx++) {
        ch = str[idx];
        if(compareString[idx] === pattern[patternIdx]) {
          ch = pre + ch + post;
          patternIdx += 1;

          // consecutive characters should increase the score more than linearly
          currScore += 1 + currScore;
        } else {
          currScore = 0;
        }
        totalScore += currScore;
        result[result.length] = ch;
      }

      // return rendered string if we have a match for every char
      if(patternIdx === pattern.length) {
        // if the string is an exact match with pattern, totalScore should be maxed
        totalScore = (compareString === pattern) ? Infinity : totalScore;
        return {rendered: result.join(''), score: totalScore};
      }

      return null;
    };

    // The normal entry point. Filters `arr` for matches against `pattern`.
    // It returns an array with matching values of the type:
    //
    //     [{
    //         string:   '<b>lah' // The rendered string
    //       , index:    2        // The index of the element in `arr`
    //       , original: 'blah'   // The original element in `arr`
    //     }]
    //
    // `opts` is an optional argument bag. Details:
    //
    //    opts = {
    //        // string to put before a matching character
    //        pre:     '<b>'
    //
    //        // string to put after matching character
    //      , post:    '</b>'
    //
    //        // Optional function. Input is an entry in the given arr`,
    //        // output should be the string to test `pattern` against.
    //        // In this example, if `arr = [{crying: 'koala'}]` we would return
    //        // 'koala'.
    //      , extract: function(arg) { return arg.crying; }
    //    }
    fuzzy.filter = function(pattern, arr, opts) {
      if(!arr || arr.length === 0) {
        return [];
      }
      if (typeof pattern !== 'string') {
        return arr;
      }
      opts = opts || {};
      return arr
        .reduce(function(prev, element, idx, arr) {
          var str = element;
          if(opts.extract) {
            str = opts.extract(element);
          }
          var rendered = fuzzy.match(pattern, str, opts);
          if(rendered != null) {
            prev[prev.length] = {
                string: rendered.rendered
              , score: rendered.score
              , index: idx
              , original: element
            };
          }
          return prev;
        }, [])

        // Sort by score. Browsers are inconsistent wrt stable/unstable
        // sorting, so force stable by using the index in the case of tie.
        // See http://ofb.net/~sethml/is-sort-stable.html
        .sort(function(a,b) {
          var compare = b.score - a.score;
          if(compare) return compare;
          return a.index - b.index;
        });
    };


    }());
    });

    var Typeahead = (function (_super) {
        tslib_1.__extends(Typeahead, _super);
        function Typeahead(props) {
            var _this = _super.call(this, props) || this;
            _this.state = {
                searchResults: _this.getOptionsForValue(props.initialValue, props.options),
                entryValue: props.value || '',
                selection: props.value,
                selectionIndex: undefined,
                isFocused: false,
                showResults: false,
            };
            return _this;
        }
        Typeahead.prototype.getDefaultProps = function () {
            return {
                allowCustomValues: 0,
                initialValue: '',
                value: '',
                disabled: false,
                textarea: false,
                customListComponent: TypeaheadSelector,
                showOptionsWhenEmpty: false,
                resultsTruncatedMessage: null,
            };
        };
        Typeahead.prototype.shouldSkipSearch = function (input) {
            var emptyValue = !input || input.trim().length === 0;
            var isFocused = this.state && this.state.isFocused;
            return !(this.props.showOptionsWhenEmpty && isFocused) && emptyValue;
        };
        Typeahead.prototype.getOptionsForValue = function (value, options) {
            if (this.shouldSkipSearch(value)) {
                return [];
            }
            var searchOptions = this.generateSearchFunction();
            return searchOptions(value, options);
        };
        Typeahead.prototype.setEntryText = function (value) {
            if (!this.inputElement)
                return;
            this.inputElement.value = value;
            this.onTextEntryUpdated();
        };
        Typeahead.prototype.focus = function () {
            if (!this.inputElement)
                return;
            this.inputElement.focus();
        };
        Typeahead.prototype.hasCustomValue = function () {
            var allowCustomValues = tslib_1.__assign({}, this.getDefaultProps, this.props).allowCustomValues;
            var _a = this.state, entryValue = _a.entryValue, searchResults = _a.searchResults;
            return (allowCustomValues &&
                allowCustomValues > 0 &&
                entryValue.length >= allowCustomValues &&
                searchResults.indexOf(this.state.entryValue) < 0);
        };
        Typeahead.prototype.getCustomValue = function () {
            if (this.hasCustomValue()) {
                return this.state.entryValue;
            }
            return null;
        };
        Typeahead.prototype.renderIncrementalSearchResults = function () {
            var _this = this;
            var _a = this.state, entryValue = _a.entryValue, selection = _a.selection, searchResults = _a.searchResults, selectionIndex = _a.selectionIndex;
            var _b = tslib_1.__assign({}, this.getDefaultProps(), this.props), maxVisible = _b.maxVisible, resultsTruncatedMessage = _b.resultsTruncatedMessage, customListComponent = _b.customListComponent, allowCustomValues = _b.allowCustomValues, customClasses = _b.customClasses, defaultClassNames = _b.defaultClassNames;
            if (this.shouldSkipSearch(entryValue)) {
                return '';
            }
            if (selection) {
                return '';
            }
            return (React.createElement("customListComponent", { innerRef: function (c) { return _this.selectElement = c; }, options: maxVisible ? searchResults.slice(0, maxVisible) : searchResults, areResultsTruncated: maxVisible && searchResults.length > maxVisible, resultsTruncatedMessage: resultsTruncatedMessage, onOptionSelected: this.onOptionSelected, allowCustomValues: allowCustomValues, customValue: this.getCustomValue(), customClasses: customClasses, selectionIndex: selectionIndex, defaultClassNames: defaultClassNames, displayOption: Accessor.generateOptionToStringFor(this.props.displayOption) }));
        };
        Typeahead.prototype.getSelection = function () {
            var index = this.state.selectionIndex;
            if (index === undefined)
                throw new Error('No index set');
            if (this.hasCustomValue()) {
                if (index === 0) {
                    return this.state.entryValue;
                }
                index -= 1;
            }
            return this.state.searchResults[index];
        };
        Typeahead.prototype.onOptionSelected = function (option, event) {
            if (!this.inputElement)
                throw new Error('No input element');
            this.inputElement.focus();
            var _a = this.props, displayOption = _a.displayOption, formInputOption = _a.formInputOption;
            displayOption = Accessor
                .generateOptionToStringFor(this.props.inputDisplayOption || displayOption);
            var optionString = displayOption(option, 0);
            formInputOption = Accessor.generateOptionToStringFor(formInputOption || displayOption);
            var formInputOptionString = formInputOption(option);
            this.inputElement.value = optionString;
            this.setState({
                searchResults: this.getOptionsForValue(optionString, this.props.options),
                selection: formInputOptionString,
                entryValue: optionString,
                showResults: false,
            });
            return this.props.onOptionSelected && this.props.onOptionSelected(option, event);
        };
        Typeahead.prototype.onTextEntryUpdated = function () {
            if (!this.inputElement)
                throw new Error('No input element');
            var value = this.inputElement.value;
            this.setState({
                searchResults: this.getOptionsForValue(value, this.props.options),
                selection: '',
                entryValue: value,
            });
        };
        Typeahead.prototype.onEnter = function (event) {
            var selection = this.getSelection();
            if (!selection) {
                return this.props.onKeyDown && this.props.onKeyDown(event);
            }
            return this.onOptionSelected(selection, event);
        };
        Typeahead.prototype.onEscape = function () {
            this.setState({
                selectionIndex: undefined,
            });
        };
        Typeahead.prototype.onTab = function (event) {
            var selection = this.getSelection();
            var option = selection ?
                selection : (this.state.searchResults.length > 0 ? this.state.searchResults[0] : null);
            if (option === null && this.hasCustomValue()) {
                option = this.getCustomValue();
            }
            if (option !== null) {
                return this.onOptionSelected(option, event);
            }
        };
        Typeahead.prototype.eventMap = function () {
            var events = {};
            events[KeyEvent.DOM_VK_UP] = this.navUp;
            events[KeyEvent.DOM_VK_DOWN] = this.navDown;
            events[KeyEvent.DOM_VK_RETURN] = events[KeyEvent.DOM_VK_ENTER] = this.onEnter;
            events[KeyEvent.DOM_VK_ESCAPE] = this.onEscape;
            events[KeyEvent.DOM_VK_TAB] = this.onTab;
            return events;
        };
        Typeahead.prototype.nav = function (delta) {
            if (!this.hasHint()) {
                return;
            }
            var _a = this.state, selectionIndex = _a.selectionIndex, searchResults = _a.searchResults;
            var maxVisible = this.props.maxVisible;
            var newIndex = selectionIndex === undefined ?
                (delta === 1 ? 0 : delta) : selectionIndex + delta;
            var length = maxVisible ? searchResults.slice(0, maxVisible).length : searchResults.length;
            if (this.hasCustomValue()) {
                length += 1;
            }
            if (newIndex < 0) {
                newIndex += length;
            }
            else if (newIndex >= length) {
                newIndex -= length;
            }
            this.setState({ selectionIndex: newIndex });
        };
        Typeahead.prototype.navDown = function () {
            this.nav(1);
        };
        Typeahead.prototype.navUp = function () {
            this.nav(-1);
        };
        Typeahead.prototype.onChange = function (event) {
            var onChange = this.props.onChange;
            if (onChange) {
                onChange(event);
            }
            this.onTextEntryUpdated();
        };
        Typeahead.prototype.onKeyDown = function (event) {
            if (!this.hasHint() || event.shiftKey) {
                return this.props.onKeyDown && this.props.onKeyDown(event);
            }
            var handler = this.eventMap()[event.keyCode];
            if (handler) {
                handler(event);
            }
            else {
                return this.props.onKeyDown && this.props.onKeyDown(event);
            }
            event.preventDefault();
        };
        Typeahead.prototype.componentWillReceiveProps = function (nextProps) {
            var searchResults = this.getOptionsForValue(this.state.entryValue, nextProps.options);
            var showResults = Boolean(searchResults.length) && this.state.isFocused;
            this.setState({ searchResults: searchResults, showResults: showResults });
        };
        Typeahead.prototype.render = function () {
            var _this = this;
            var _a = tslib_1.__assign({}, this.getDefaultProps(), this.props), input = _a.customClasses.input, className = _a.className;
            var inputClasses = {};
            if (input) {
                inputClasses[input] = true;
            }
            var inputClassList = classnames(inputClasses);
            var classes = {
                typeahead: this.props.defaultClassNames,
            };
            if (className) {
                classes[className] = true;
            }
            var classList = classnames(classes);
            return (React.createElement("div", { className: classList },
                this.renderHiddenInput(),
                React.createElement(reactstrap.Input, tslib_1.__assign({ innerRef: function (c) {
                        _this.inputElement = c;
                        _this.props.innerRef && _this.props.innerRef(c);
                    }, type: this.props.textarea ? 'textarea' : 'text', disabled: this.props.disabled }, this.props.inputProps, { placeholder: this.props.placeholder, className: inputClassList, value: this.state.entryValue, onChange: this.onChange, onKeyDown: this.onKeyDown, onKeyPress: this.props.onKeyPress, onKeyUp: this.props.onKeyUp, onFocus: this.onFocus, onBlur: this.onBlur })),
                this.state.showResults && this.renderIncrementalSearchResults()));
        };
        Typeahead.prototype.onFocus = function (event) {
            var _this = this;
            this.setState({ isFocused: true, showResults: true }, function () {
                _this.onTextEntryUpdated();
            });
            if (this.props.onFocus) {
                return this.props.onFocus(event);
            }
        };
        Typeahead.prototype.onBlur = function (event) {
            var _this = this;
            this.setState({ isFocused: false }, function () {
                _this.onTextEntryUpdated();
            });
            if (this.props.onBlur) {
                return this.props.onBlur(event);
            }
        };
        Typeahead.prototype.renderHiddenInput = function () {
            var name = this.props.name;
            if (!name) {
                return null;
            }
            return (React.createElement("input", { type: "hidden", name: name, value: this.state.selection }));
        };
        Typeahead.prototype.generateSearchFunction = function () {
            var _a = this.props, searchOptions = _a.searchOptions, filterOption = _a.filterOption;
            if (typeof searchOptions === 'function') {
                if (filterOption !== null) {
                    console.warn('searchOptions prop is being used, filterOption prop will be ignored');
                }
                return searchOptions;
            }
            if (typeof filterOption === 'function') {
                return function (value, options) {
                    return options.filter(function (o) { return filterOption(value, o); });
                };
            }
            var mapper;
            if (typeof filterOption === 'string') {
                mapper = Accessor.generateAccessor(filterOption);
            }
            else {
                mapper = Accessor.IDENTITY_FN;
            }
            return function (value, options) {
                var fuzzyOpt = { extract: mapper };
                return fuzzy
                    .filter(value, options, fuzzyOpt)
                    .map(function (res) { return options[res.index]; });
            };
        };
        Typeahead.prototype.hasHint = function () {
            return this.state.searchResults.length > 0 || this.hasCustomValue();
        };
        return Typeahead;
    }(React.Component));

    var Token = (function (_super) {
        tslib_1.__extends(Token, _super);
        function Token() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Token.prototype.render = function () {
            var className = classnames([
                'typeahead-token',
                this.props.className,
            ]);
            return (React.createElement("div", { className: className, key: this.props.key },
                this.renderHiddenInput(),
                this.props.children,
                this.renderCloseButton()));
        };
        Token.prototype.renderHiddenInput = function () {
            var _a = this.props, name = _a.name, value = _a.value, object = _a.object;
            if (!name) {
                return null;
            }
            var hiddenValue = value || object;
            if (typeof hiddenValue !== 'string') {
                throw new Error('Expected either string value or string object');
            }
            return (React.createElement("input", { type: "hidden", name: name + '[]', value: hiddenValue }));
        };
        Token.prototype.renderCloseButton = function () {
            var _this = this;
            if (!this.props.onRemove) {
                return '';
            }
            return (React.createElement("a", { className: this.props.className || 'typeahead-token-close', href: "#", onClick: function (event) {
                    _this.props.onRemove(_this.props.object);
                    event.preventDefault();
                } }, "\u00D7"));
        };
        return Token;
    }(React.Component));

    var arraysAreDifferent = function (array1, array2) {
        if (array1.length !== array2.length) {
            return true;
        }
        for (var i = array2.length - 1; i >= 0; i -= 1) {
            if (array2[i] !== array1[i]) {
                return true;
            }
        }
        return false;
    };
    var TypeaheadTokenizer = (function (_super) {
        tslib_1.__extends(TypeaheadTokenizer, _super);
        function TypeaheadTokenizer(props) {
            var _this = _super.call(this, props) || this;
            _this.state = {
                selected: _this.props.defaultSelected.slice(0),
            };
            return _this;
        }
        TypeaheadTokenizer.prototype.getDefaultProps = function () {
            var customClasses = {};
            return {
                customClasses: customClasses,
                allowCustomValues: 0,
                disabled: false,
                inputProps: {},
                defaultClassNames: true,
                displayOption: function (token) { return token; },
                showOptionsWhenEmpty: false,
            };
        };
        TypeaheadTokenizer.prototype.componentWillReceiveProps = function (nextProps) {
            if (arraysAreDifferent(this.props.defaultSelected, nextProps.defaultSelected)) {
                this.setState({ selected: nextProps.defaultSelected.slice(0) });
            }
        };
        TypeaheadTokenizer.prototype.focus = function () {
            if (!this.typeaheadElement)
                throw new Error('No typeahead element');
            this.typeaheadElement.focus();
        };
        TypeaheadTokenizer.prototype.getSelectedTokens = function () {
            return this.state.selected;
        };
        TypeaheadTokenizer.prototype.renderTokens = function () {
            var _this = this;
            var _a = tslib_1.__assign({}, this.getDefaultProps(), this.props), token = _a.customClasses.token, displayOption = _a.displayOption, formInputOption = _a.formInputOption, name = _a.name;
            var tokenClasses = {};
            if (token)
                tokenClasses[token] = true;
            var classList = classnames(tokenClasses);
            var result = this.state.selected
                .map(function (selected) {
                var displayString = Accessor.valueForOption(displayOption, selected);
                var value = Accessor.valueForOption(formInputOption || displayOption, selected);
                if (!displayString || !value)
                    throw new Error('Expected string and value to exist');
                var key = displayString;
                return (React.createElement(Token, { key: key, className: classList, onRemove: _this.removeTokenForValue, object: selected, value: value, name: name }, displayString));
            });
            return result;
        };
        TypeaheadTokenizer.prototype.getOptionsForTypeahead = function () {
            return this.props.options;
        };
        TypeaheadTokenizer.prototype.onKeyDown = function (event) {
            if (event.keyCode === KeyEvent.DOM_VK_BACK_SPACE) {
                return this.handleBackspace(event);
            }
            this.props.onKeyDown && this.props.onKeyDown(event);
        };
        TypeaheadTokenizer.prototype.handleBackspace = function (event) {
            if (!this.state.selected.length) {
                return;
            }
            if (!this.typeaheadElement)
                throw new Error('Expected typeahead element to exist');
            if (this.typeaheadElement.selectionStart === this.typeaheadElement.selectionEnd &&
                this.typeaheadElement.selectionStart === 0) {
                this.removeTokenForValue(this.state.selected[this.state.selected.length - 1]);
                event.preventDefault();
            }
        };
        TypeaheadTokenizer.prototype.removeTokenForValue = function (value) {
            var index = this.state.selected.indexOf(value);
            if (index === -1) {
                return;
            }
            this.state.selected.splice(index, 1);
            this.setState({ selected: this.state.selected });
            this.props.onTokenRemove && this.props.onTokenRemove(value);
            return;
        };
        TypeaheadTokenizer.prototype.addTokenForValue = function (value) {
            var selected = this.state.selected;
            if (selected.indexOf(value) !== -1) {
                return;
            }
            selected = selected.concat([value]);
            this.setState({ selected: selected });
            if (!this.typeaheadElement)
                throw new Error('Expected typahead to be set');
            this.typeaheadElement.value = '';
            this.props.onTokenAdd && this.props.onTokenAdd(value);
        };
        TypeaheadTokenizer.prototype.render = function () {
            var _this = this;
            var _a = tslib_1.__assign({}, this.getDefaultProps(), this.props), className = _a.className, _b = _a.customClasses, customClasses = _b === void 0 ? {} : _b, disabled = _a.disabled, inputProps = _a.inputProps, allowCustomValues = _a.allowCustomValues, _c = _a.initialValue, initialValue = _c === void 0 ? '' : _c, maxVisible = _a.maxVisible, resultsTruncatedMessage = _a.resultsTruncatedMessage, placeholder = _a.placeholder, onKeyPress = _a.onKeyPress, onKeyUp = _a.onKeyUp, onFocus = _a.onFocus, onBlur = _a.onBlur, displayOption = _a.displayOption, defaultClassNames = _a.defaultClassNames, filterOption = _a.filterOption, searchOptions = _a.searchOptions, showOptionsWhenEmpty = _a.showOptionsWhenEmpty;
            var classes = {};
            var typeahead = customClasses.typeahead;
            if (typeahead) {
                classes[typeahead] = true;
            }
            var classList = classnames(classes);
            var tokenizerClasses = [];
            if (defaultClassNames) {
                tokenizerClasses.push('typeahead-tokenizer');
            }
            if (className) {
                tokenizerClasses.push(className);
            }
            var tokenizerClassList = classnames(tokenizerClasses);
            var args2Pass = {
                placeholder: placeholder,
                disabled: disabled,
                inputProps: inputProps,
                customClasses: customClasses,
                allowCustomValues: allowCustomValues,
                initialValue: initialValue,
                maxVisible: maxVisible,
                resultsTruncatedMessage: resultsTruncatedMessage,
                onKeyPress: onKeyPress,
                onKeyUp: onKeyUp,
                onFocus: onFocus,
                onBlur: onBlur,
                displayOption: displayOption,
                defaultClassNames: defaultClassNames,
                filterOption: filterOption,
                searchOptions: searchOptions,
                showOptionsWhenEmpty: showOptionsWhenEmpty,
            };
            return (React.createElement("div", { className: tokenizerClassList },
                this.renderTokens(),
                React.createElement(Typeahead, tslib_1.__assign({ innerRef: function (c) { return _this.typeaheadElement = c; }, className: classList }, args2Pass, { options: this.getOptionsForTypeahead(), onOptionSelected: this.addTokenForValue, onKeyDown: this.onKeyDown }))));
        };
        return TypeaheadTokenizer;
    }(React.Component));

    exports.Typeahead = Typeahead;
    exports.Tokenizer = TypeaheadTokenizer;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=textarea.umd.js.map
