'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.localStorageEffect = void 0
var recoil_1 = require('recoil')
var isSSR_1 = __importDefault(require('./isSSR'))
/**
 * Recoil atom effect that provides LocalStorage persistence.
 *
 * Stores the state in LocalStorage using `JSON.stringify`. **Please ensure that
 * the state returned is valid as this can be edited by users in DevTools.**
 *
 * @param key Key name for the state in LocalStorage
 *
 * @example <caption>Persist Recoil state under 'my-state-in-LS' key</caption>
 * atom<StateType>({
 *   key: 'myState',
 *   default: { data: null },
 *   effects_UNSTABLE: [localStorageEffect<StateType>('my-state-in-LS')]
 * })
 */
function localStorageEffect(key) {
  return function (_a) {
    var setSelf = _a.setSelf,
      onSet = _a.onSet
    var savedValue = isSSR_1.default() ? null : localStorage.getItem(key)
    if (savedValue !== null) {
      setSelf(JSON.parse(savedValue))
    }
    onSet(function (newValue) {
      if (newValue instanceof recoil_1.DefaultValue) {
        !isSSR_1.default() && localStorage.removeItem(key)
      } else {
        !isSSR_1.default() && localStorage.setItem(key, JSON.stringify(newValue))
      }
    })
  }
}
exports.localStorageEffect = localStorageEffect
