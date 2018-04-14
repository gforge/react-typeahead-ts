import * as tslib_1 from "tslib";
import * as React from 'react';
import classNames from 'classnames';
var TypeaheadOption = (function (_super) {
    tslib_1.__extends(TypeaheadOption, _super);
    function TypeaheadOption(props) {
        var _this = _super.call(this, props) || this;
        _this.onClick = _this.onClick.bind(_this);
        return _this;
    }
    TypeaheadOption.prototype.getProps = function () {
        var customClasses = { hover: 'hover' };
        return tslib_1.__assign({
            customClasses: customClasses,
            onClick: function (event) {
                event.preventDefault();
            },
            hover: false,
        }, this.props);
    };
    TypeaheadOption.prototype.render = function () {
        var _a = this.getProps(), customClasses = _a.customClasses, hover = _a.hover, children = _a.children, customValue = _a.customValue;
        var classes = {};
        var listItem = customClasses.listItem, _b = customClasses.hover, hoverClass = _b === void 0 ? 'hover' : _b, customAdd = customClasses.customAdd;
        classes[hoverClass] = Boolean(hover);
        if (listItem) {
            classes[listItem] = Boolean(listItem);
        }
        if (customValue && customAdd) {
            classes[customAdd] = Boolean(customAdd);
        }
        var classList = classNames(classes);
        return (React.createElement("li", { className: classList, onClick: this.onClick, onMouseDown: this.onClick },
            React.createElement("a", { href: "javascript: void 0;", className: this.getClasses() }, children)));
    };
    TypeaheadOption.prototype.getClasses = function () {
        var customClasses = this.getProps().customClasses;
        var classes = {
            'typeahead-option': true,
        };
        var listAnchor = customClasses.listAnchor;
        if (listAnchor) {
            classes[listAnchor] = true;
        }
        return classNames(classes);
    };
    TypeaheadOption.prototype.onClick = function (event) {
        event.preventDefault();
        return this.props.onClick(event);
    };
    return TypeaheadOption;
}(React.Component));
export default TypeaheadOption;
//# sourceMappingURL=option.js.map