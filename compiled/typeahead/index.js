import * as tslib_1 from "tslib";
import * as React from 'react';
import Accessor from '../accessor';
import TypeaheadSelector from './selector';
import KeyEvent from '../keyevent';
import fuzzy from 'fuzzy';
import classNames from 'classnames';
import { Input } from 'reactstrap';
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
        var inputClassList = classNames(inputClasses);
        var classes = {
            typeahead: this.props.defaultClassNames,
        };
        if (className) {
            classes[className] = true;
        }
        var classList = classNames(classes);
        return (React.createElement("div", { className: classList },
            this.renderHiddenInput(),
            React.createElement(Input, tslib_1.__assign({ innerRef: function (c) {
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
export default Typeahead;
//# sourceMappingURL=index.js.map