"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.persistentAtom = void 0;
var recoil_1 = require("recoil");
var storageEffect_1 = require("./storageEffect");
/**
 * A wrapper around Recoil's `atom` to automate LocalStorage persistence.
 *
 * Accepts all the normal atom options, then the key to use for local storage on top of that.
 *
 * Stores the state in LocalStorage using `JSON.stringify`. **Please ensure that
 * the state returned is valid as this can be edited by users in DevTools.**
 *
 * @param atomOptions The options supplied to Recoil's `atom()`
 * @param persistOptions (Optional) The options used for persistence
 *
 * @example <caption>Persist using default options</caption>
 *
 *          // Persists under 'myState' key in LocalStorage
 *          persistentAtom<StateType>({
 *            key: 'myState',
 *            default: { data: null },
 *          })
 *
 * @example <caption>Persist in SessionStorage</caption>
 *
 *          // Persists under 'my-state' key in SessionStorage
 *          persistentAtom<StateType>(
 *            {
 *              key: 'myState',
 *              default: { data: null },
 *            },
 *            {
 *              storageKey: 'my-state',
 *              storage: window.sessionStorage,
 *            },
 *          )
 */
function persistentAtom(atomOptions, persistOptions) {
    var key = (persistOptions === null || persistOptions === void 0 ? void 0 : persistOptions.storageKey) || atomOptions.key;
    if (typeof key !== 'string') {
        console.warn('LocalStorage key provided that is not a string. This may cause issues. Key:', key);
    }
    var existingEffects = atomOptions.effects_UNSTABLE;
    var finalOptions = __assign(__assign({}, atomOptions), { effects_UNSTABLE: __spreadArray(__spreadArray([], (existingEffects || [])), [storageEffect_1.storageEffect(key, persistOptions === null || persistOptions === void 0 ? void 0 : persistOptions.storage, persistOptions === null || persistOptions === void 0 ? void 0 : persistOptions.validator)]) });
    return recoil_1.atom(finalOptions);
}
exports.persistentAtom = persistentAtom;
