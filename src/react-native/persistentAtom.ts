import { AtomOptions, atom, RecoilState } from 'recoil'
import { IRNStorageSystem, storageEffect } from './storageEffect'

interface IRNPersistOptions {
  /**
   * (Optional) Key to use in storage. Defaults to the atom's key.
   */
  storageKey?: string
  /**
   * (Optional) A function which accepts a data object retrieved from storage and returns whether it should be loaded as the state (is valid)
   *
   * @example
   * (data: object) => {
   *   // will not load if falsy
   *   if (!data) return false
   *   // will not load if items property non-existant or not array
   *   if (!data.items || !Array.isArray(data.items)) return false
   *   // will not load if data.items contains non-string items
   *   if (data.item.filter(d => typeof d !== 'string').length > 0) return false
   *
   *   return true
   * }
   */
  validator?: (data: object) => boolean
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
 * @param persistOptions (Optional) The options used for persistence
 * @param storage (Optional) Custom storage system to use. Defaults to using `@react-native-async-storage/async-storage`.
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
 *            setItem: async (k, d) => {}, // ...
 *            getItem: async (k) => {}, // ...
 *            removeItem: async (k) => {}, // ...
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
export function persistentAtom<T>(atomOptions: AtomOptions<T>, persistOptions?: IRNPersistOptions, storage?: IRNStorageSystem): RecoilState<T> {
  const key = persistOptions?.storageKey || atomOptions.key

  if (typeof key !== 'string') {
    console.warn('Storage key provided that is not a string. This may cause issues. Key:', key)
  }

  const { effects_UNSTABLE: existingEffects } = atomOptions

  const finalOptions: AtomOptions<T> = {
    ...atomOptions,
    effects_UNSTABLE: [...(existingEffects || []), storageEffect<T>(key, storage, persistOptions?.validator)],
  }

  return atom<T>(finalOptions)
}
