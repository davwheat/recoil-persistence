import { AtomOptions, RecoilState } from 'recoil';
import { IRNStorageSystem } from './storageEffect';
interface IRNPersistOptions {
    /**
     * (Optional) Key to use in storage. Defaults to the atom's key.
     */
    storageKey?: string;
}
/**
 * A wrapper around Recoil's `atom` to automate state persistence in React Native.
 *
 * If no storage system is provided, it will use `@react-native-async-storage/async-storage`.
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
 * @example <caption>Persist in custom storage system</caption>
 *          const myStorageSystem = {
 *            setItem: async (k, d) => // ...
 *            getItem: async (k) => // ...
 *            removeItem: async (k) => // ...
 *          }
 *
 *          // Persists under 'my-state' key in custom storage system
 *          persistentAtom<StateType>(
 *            {
 *              key: 'myState',
 *              default: { data: null },
 *            },
 *            {
 *              storageKey: 'my-state',
 *            },
 *            myStorageSystem
 *          )
 */
export declare function persistentAtom<T>(atomOptions: AtomOptions<T>, persistOptions: IRNPersistOptions, storage?: IRNStorageSystem): RecoilState<T>;
export {};
