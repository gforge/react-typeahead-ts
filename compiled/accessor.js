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
export default Accessor;
//# sourceMappingURL=accessor.js.map