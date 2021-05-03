import { AtomOptions, RecoilState } from 'recoil';
interface IPersistOptions {
    /**
     * (Optional) Key to use in storage. Defaults to the atom's key.
     */
    storageKey?: string;
    /**
     * (Optional) Type of storage to use. Defaults to `localStorage`.
     */
    storage?: Storage;
}
/**
 * A wrapper around Recoil's `atom` to automate LocalStorage persistence.
 *
 * Accepts all the normal atom options, then the key to use for local storage on top of that.
 *
 * Stores the state in LocalStorage using `JSON.stringify`. **Please ensure that
 * the state returned is valid as this can be edited by users in DevTools.**
 *
 * @param atomOptions The options supplied to Recoil's `atom()`
 * @param persistOptions The options used for persistence
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
export declare function persistentAtom<T>(atomOptions: AtomOptions<T>, persistOptions: IPersistOptions): RecoilState<T>;
export {};
