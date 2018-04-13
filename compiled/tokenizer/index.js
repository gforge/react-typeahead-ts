import * as tslib_1 from "tslib";
import * as React from 'react';
import Accessor from '../accessor';
import Token from './token';
import KeyEvent from '../keyevent';
import Typeahead from '../typeahead';
import classNames from 'classnames';
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
        var classList = classNames(tokenClasses);
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
        var classList = classNames(classes);
        var tokenizerClasses = [];
        if (defaultClassNames) {
            tokenizerClasses.push('typeahead-tokenizer');
        }
        if (className) {
            tokenizerClasses.push(className);
        }
        var tokenizerClassList = classNames(tokenizerClasses);
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
export default TypeaheadTokenizer;
//# sourceMappingURL=index.js.map