'use strict';Object.defineProperty(exports,'__esModule',{value:true});/********************************************************************************************************************
 * URL을 조합해서 반환
 * @param parts URL 조각
 * ******************************************************************************************************************/
function urlJoin() {
    var parts = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        parts[_i] = arguments[_i];
    }
    return parts.reduce(function (acc, part) {
        if (acc === '') {
            return part;
        }
        else if (part.startsWith('?')) {
            return "".concat(acc).concat(part);
        }
        else if (acc.endsWith('/')) {
            return "".concat(acc).concat(part.startsWith('/') ? part.substring(1) : part);
        }
        else {
            return "".concat(acc).concat(part.startsWith('/') ? part : "/".concat(part));
        }
    });
}var index = {
    join: urlJoin
};exports.default=index;exports.urlJoin=urlJoin;