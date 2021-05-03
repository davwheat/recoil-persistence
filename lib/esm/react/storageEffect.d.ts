import { AtomEffect } from 'recoil';
/**
 * Recoil atom effect that provides LocalStorage persistence.
 *
 * Stores the state in LocalStorage using `JSON.stringify`. **Please ensure that
 * the state returned is valid as this can be edited by users in DevTools.**
 *
 * @param key Key name for the state in LocalStorage
 * @param storage (optional) Either `localStorage` or `sessionStorage`
 *
 * @example <caption>Persist Recoil state under 'my-state-in-LS' key</caption>
 *          atom<StateType>({
 *            key: 'myState',
 *            default: { data: null },
 *            effects_UNSTABLE: [localStorageEffect<StateType>('my-state-in-LS', localStorage)]
 *          })
 */
export declare function localStorageEffect<T>(key: string, storage?: Storage | undefined): AtomEffect<T>;