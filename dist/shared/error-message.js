"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeButterEnumsErrorMessage = makeButterEnumsErrorMessage;
function makeButterEnumsErrorMessage(message) {
    return {
        __error__: message,
        value: undefined,
    };
}
