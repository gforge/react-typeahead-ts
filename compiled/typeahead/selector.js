import * as tslib_1 from "tslib";
import * as React from 'react';
import classNames from 'classnames';
import TypeaheadOption from './option';
var TypeaheadSelector = (function (_super) {
    tslib_1.__extends(TypeaheadSelector, _super);
    function TypeaheadSelector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TypeaheadSelector.prototype.getProps = function () {
        var customClasses = {};
        return tslib_1.__assign({
            customClasses: customClasses,
            allowCustomValues: 0,
            onOptionSelected: function () { },
            defaultClassNames: true,
        }, this.props);
    };
    TypeaheadSelector.prototype.render = function () {
        var _this = this;
        var _a = this.getProps(), options = _a.options, customClasses = _a.customClasses, customValue = _a.customValue, displayOption = _a.displayOption, defaultClassNames = _a.defaultClassNames, allowCustomValues = _a.allowCustomValues, selectionIndex = _a.selectionIndex, areResultsTruncated = _a.areResultsTruncated, resultsTruncatedMessage = _a.resultsTruncatedMessage;
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
        var classList = classNames(classes);
        var customValueComponent;
        var customValueOffset = 0;
        if (customValue) {
            customValueOffset += 1;
            customValueComponent = (React.createElement(TypeaheadOption, { key: customValue, hover: selectionIndex === 0, customClasses: customClasses, customValue: customValue, onClick: this.onClick.bind(this, customValue) }, customValue));
        }
        var results = options.map(function (result, i) {
            var displayString = displayOption(result, i);
            var uniqueKey = displayString + '_' + i;
            return (React.createElement(TypeaheadOption, { key: uniqueKey, hover: selectionIndex === i + customValueOffset, customClasses: customClasses, onClick: _this.onClick.bind(_this, result) }, displayString));
        });
        if (areResultsTruncated && resultsTruncatedMessage) {
            var resultsTruncatedClasses = {
                'results-truncated': defaultClassNames,
            };
            var resultsTruncated = customClasses.resultsTruncated;
            if (resultsTruncated) {
                resultsTruncatedClasses[resultsTruncated] = true;
            }
            var resultsTruncatedClassList = classNames(resultsTruncatedClasses);
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
export default TypeaheadSelector;
//# sourceMappingURL=selector.js.map