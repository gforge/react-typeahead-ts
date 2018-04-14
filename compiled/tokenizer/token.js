import * as tslib_1 from "tslib";
import * as React from 'react';
import classNames from 'classnames';
var Token = (function (_super) {
    tslib_1.__extends(Token, _super);
    function Token() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Token.prototype.render = function () {
        var className = classNames([
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
export default Token;
//# sourceMappingURL=token.js.map