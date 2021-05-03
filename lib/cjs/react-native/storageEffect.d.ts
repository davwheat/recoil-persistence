import { AtomEffect } from 'recoil';
/**
 * An asynchronous storage system, with an API based off of
 * `@react-native-async-storage/async-storage`.
 */
export interface IRNStorageSystem {
    /**
     * Async function to set an item's value in the storage system.
     */
    setItem: (key: string, data: string) => Promise<void>;
    /**
     * Async function to set an item's value in the storage system.
     */
    getItem: (key: string) => Promise<string>;
    /**
     * Async function to remove an item's entry from the storage system.
     */
    removeItem: (key: string) => Promise<void>;
}
/**
 * Recoil atom effect that provides persistence via a specified storage system.
 *
 * If no storage system is provided, it will use `@react-native-async-storage/async-storage`.
 *
 * A storage system must implement `IStorageSystem`'s methods fully. If your storage system
 * uses synchronous access (which it should not), wrap calls in a promise
 *
 * @param key Key name for the state in LocalStorage
 * @param storage (optional) A storage system that implements IRNStorageSystem
 *
 * @example <caption>Persist Recoil state under 'my-state-in-LS' key</caption>
 *          atom<StateType>({
 *            key: 'myState',
 *            default: { data: null },
 *            effects_UNSTABLE: [storageEffect<StateType>('my-state-in-LS')]
 *          })
 */
export declare function storageEffect<T>(key: string, storage?: IRNStorageSystem): AtomEffect<T>;
