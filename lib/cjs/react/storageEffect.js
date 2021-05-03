"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageEffect = void 0;
var recoil_1 = require("recoil");
var isSSR_1 = __importDefault(require("./isSSR"));
/**
 * Recoil atom effect that provides `LocalStorage` or `SessionStorage` persistence.
 *
 * Stores the state in storage using `JSON.stringify`. **Please ensure that
 * the state returned is valid as this can be edited by users in DevTools.**
 *
 * Defaults to storing in `window.localStorage`.
 *
 * @param key Key name for the state in storage
 * @param storage (optional) Either `localStorage` or `sessionStorage`
 * @param validator (optional) A function which accepts a data object retrieved from storage and returns whether it should be loaded as the state (is valid)
 *
 * @example <caption>Persist Recoil state under 'my-state-in-LS' key</caption>
 *          atom<StateType>({
 *            key: 'myState',
 *            default: { data: null },
 *            effects_UNSTABLE: [storageEffect<StateType>('my-state-in-LS')]
 *          })
 */
function storageEffect(key, storage, validator) {
    if (storage === void 0) { storage = isSSR_1.default() ? undefined : localStorage; }
    if (validator === void 0) { validator = function () { return true; }; }
    return function (_a) {
        var setSelf = _a.setSelf, onSet = _a.onSet;
        var savedValue = storage ? storage.getItem(key) : null;
        if (savedValue !== null) {
            try {
                var data = JSON.parse(savedValue);
                if (validator(data)) {
                    setSelf(data);
                }
            }
            catch (e) {
                // Value in storage is invalid
            }
        }
        onSet(function (newValue) {
            if (newValue instanceof recoil_1.DefaultValue) {
                storage && storage.removeItem(key);
            }
            else {
                storage && storage.setItem(key, JSON.stringify(newValue));
            }
        });
    };
}
exports.storageEffect = storageEffect;