import { AtomEffect, DefaultValue } from 'recoil'

/**
 * An asynchronous storage system, with an API based off of
 * `@react-native-async-storage/async-storage`.
 */
export interface IRNStorageSystem {
  /**
   * Async function to set an item's value in the storage system.
   */
  setItem: (key: string, data: string) => Promise<void>

  /**
   * Async function to set an item's value in the storage system.
   */
  getItem: (key: string) => Promise<string | null>

  /**
   * Async function to remove an item's entry from the storage system.
   */
  removeItem: (key: string) => Promise<void>
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
 * @param validator (optional) A function which accepts a data object retrieved from storage and returns whether it should be loaded as the state (is valid)
 *
 * @example <caption>Persist Recoil state under 'my-state-in-LS' key</caption>
 *          atom<StateType>({
 *            key: 'myState',
 *            default: { data: null },
 *            effects_UNSTABLE: [storageEffect<StateType>('my-state-in-LS')]
 *          })
 */
export function storageEffect<T>(key: string, storage?: IRNStorageSystem, validator: (data: T) => boolean = () => true): AtomEffect<T> {
  return ({ setSelf, onSet, trigger }) => {
    if (trigger === 'get') {
      const loadPersisted = async (storageSystem: IRNStorageSystem) => {
        try {
          const savedValue = await storageSystem.getItem(key)

          if (savedValue !== null) {
            const data = JSON.parse(savedValue)

            if (validator(data)) {
              setSelf(data)
            }
          }
        } catch (e) {
          console.error('Failed to read persisted data.', e)
        }
      }

      if (storage) {
        loadPersisted(storage)
      } else {
        import('@react-native-async-storage/async-storage')
          .then(asyncStorage => {
            loadPersisted(asyncStorage.default as IRNStorageSystem)
          })
          .catch(e => {
            console.error(
              "Looks like you didn't pass a storage system to storageEffect or persistentAtom. You either need to pass one, or install `@react-native-async-storage/async-storage`.",
            )
            console.error(e)
          })
      }
    }

    onSet((newValue: T) => {
      if (newValue instanceof DefaultValue) {
        if (storage) {
          storage.removeItem(key)
        } else {
          import('@react-native-async-storage/async-storage')
            .then(asyncStorage => {
              asyncStorage.default.removeItem(key)
            })
            .catch(e => {
              console.error(
                "Looks like you didn't pass a storage system to storageEffect or persistentAtom. You either need to pass one, or install `@react-native-async-storage/async-storage`.",
              )
              console.error(e)
            })
        }
      } else {
        storage && storage.setItem(key, JSON.stringify(newValue))
        if (storage) {
          storage.setItem(key, JSON.stringify(newValue))
        } else {
          import('@react-native-async-storage/async-storage')
            .then(asyncStorage => {
              asyncStorage.default.setItem(key, JSON.stringify(newValue))
            })
            .catch(e => {
              console.error(
                "Looks like you didn't pass a storage system to storageEffect or persistentAtom. You either need to pass one, or install `@react-native-async-storage/async-storage`.",
              )
              console.error(e)
            })
        }
      }
    })
  }
}
