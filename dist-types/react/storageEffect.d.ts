import { AtomEffect } from 'recoil';
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
export declare function storageEffect<T>(key: string, storage?: Storage | undefined, validator?: (data: object) => boolean): AtomEffect<T>;
