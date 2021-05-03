import { DefaultValue } from 'recoil';
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
export function localStorageEffect(key) {
    return function (_a) {
        var setSelf = _a.setSelf, onSet = _a.onSet;
        var savedValue = localStorage.getItem(key);
        if (savedValue !== null) {
            setSelf(JSON.parse(savedValue));
        }
        onSet(function (newValue) {
            if (newValue instanceof DefaultValue) {
                localStorage.removeItem(key);
            }
            else {
                localStorage.setItem(key, JSON.stringify(newValue));
            }
        });
    };
}
