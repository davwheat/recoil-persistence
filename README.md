# Recoil Persistence <!-- omit in toc -->

[![](https://img.shields.io/badge/-Sponsor-fafbfc?logo=GitHub%20Sponsors)](https://github.com/sponsors/davwheat) ![](https://img.shields.io/badge/recoil-0.2.0-brightgreen)

Persist your Recoil states between site/app loads. Written in Typescript with detailed type declarations.

**Supports React and React Native.**

Please note that Recoil Atom Effects are experimental and the API is still evolving, hence they are used as `effects_UNSTABLE`. Due to the fact that the syntax could completely change at any moment, this repo might not always work with the latest verison of recoil

**Current known working version of Recoil:** `0.2.0`

## Contents <!-- omit in toc -->

- [API](#api)
  - [React](#react)
    - [`persistentAtom`](#persistentatom)
      - [`atomOptions`](#atomoptions)
      - [`persistOptions`](#persistoptions)
      - [Examples](#examples)
    - [`storageEffect`](#storageeffect)
      - [Examples](#examples-1)
  - [React Native](#react-native)
    - [`persistentAtom`](#persistentatom-1)
      - [`atomOptions`](#atomoptions-1)
      - [`persistOptions`](#persistoptions-1)
      - [`storage`](#storage)
      - [Examples](#examples-2)
    - [`storageEffect`](#storageeffect-1)
      - [Examples](#examples-3)

## API

We have support for React and React Native. You should only use the version you need.

There are minor differences between both versions, so read the documentation for the specific version you are using.

```ts
// React
import { persistentAtom } from 'recoil-persistence/react'

// React Native
import { persistentAtom } from 'recoil-persistence/react-native'
```

### React

#### `persistentAtom`

A drop-in replacement for [Recoil's `atom`](https://recoiljs.org/docs/basic-tutorial/atoms).

Accepts two parameters: `atomOptions` and `persistOptions`.

##### `atomOptions`

`atomOptions` holds the options you'd normally pass to `atom()`, including your `key` and `default`.

##### `persistOptions`

`persistOptions` holds options relating to state persistence. These options are all optional:

- `persistOptions.key` allows you provide a custom key to use for the state in storage, otherwise we default to the atom's key.
- `persistOptions.storage` allows you to override the default Storage location of `localStorage`
- `persistOptions.validator` a function to check that the data from Storage is valid.

**We don't perform any validation on the returned string from storage.** Please do this yourself via the `validator` option as users can easily edit LocalStorage and SessionStorage.

##### Examples

```ts
// Default options
const todoListState = persistentAtom({
  key: 'todoListState',
  default: [],
})

// Customised options
const todoListState_custom = persistentAtom(
  {
    key: 'todoListState',
    default: [],
  },
  {
    key: 'todo-state',
    storage: SessionStorage,
    validator: data => data !== null, // Won't load the data if it's equal to null
  },
)
```

#### `storageEffect`

A Recoil atom effect that performs the persistence.

If you don't want to use the atom wrapper for some reason, you can use this instead.

`storageEffect` accepts three parameters:

- `key` The key that the data is stored under in Storage.
- `storage` (Optional) Allows you to choose between `window.localStorage` (default) and `window.sessionStorage`.
- `validator` (Optional) A function to check that the data from Storage is valid.

**We don't perform any validation on the returned string from storage.** Please do this yourself via the `validator` parameter as users can easily edit LocalStorage and SessionStorage.

##### Examples

```ts
// Stores the value of state in LocalStorage under `my-state-in-LS` key
atom<StateType>({
  key: 'myState',
  default: { data: null },
  effects_UNSTABLE: [storageEffect<StateType>('my-state-in-LS')],
})

// Stores the value of state in SessionStorage under `my-state2-in-SS` key
atom<StateType>({
  key: 'myState2',
  default: { data: null },
  effects_UNSTABLE: [storageEffect<StateType>('my-state2-in-SS', window.sessionStorage)],
})

// Stores the value of state in LocalStorage (default) under `my-state3-in-LS` key
atom<StateType>({
  key: 'myState3',
  default: { data: null },
  effects_UNSTABLE: [
    storageEffect<StateType>(
      'my-state3-in-SS',
      undefined,
      data => data !== null, // Won't load the data if it's equal to null
    ),
  ],
})
```

### React Native

#### `persistentAtom`

A drop-in replacement for [Recoil's `atom`](https://recoiljs.org/docs/basic-tutorial/atoms).

Accepts three parameters: `atomOptions`, `persistOptions` and `storage`.

##### `atomOptions`

`atomOptions` holds the options you'd normally pass to `atom()`, including your `key` and `default`.

##### `persistOptions`

`persistOptions` holds options relating to state persistence. These options are all optional:

- `persistOptions.storageKey` allows you provide a custom key to use for the state in storage, otherwise we default to the atom's key.
- `persistOptions.validator` a function to check that the data from Storage is valid.

**We don't perform any validation on the returned string from storage.** Please do this yourself via the `validator` option as users can easily edit LocalStorage and SessionStorage.

##### `storage`

You cna use this parameter to pass a custom storage system. This system should implement the `IRNStorageSystem` interface.

If this is missing or `undefined`, we'll use [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage) by default. Make sure this is installed as a dependency in your project.

```ts
const myStorageSystem = {
  setItem: async (key, data) => {}, // set `data` in storage system under `key`
  getItem: async key => {}, // set data from storage system by `key`
  removeItem: async key => {}, // remove data from storage system by `key`
}
```

##### Examples

```ts
// Default options
const todoListState = persistentAtom({
  key: 'todoListState',
  default: [],
})

// Customised options
const todoListState_custom = persistentAtom(
  {
    key: 'todoListState',
    default: [],
  },
  {
    storageKey: 'todo-state',
    validator: data => data !== null, // Won't load the data if it's equal to null
  },
  myStorageSystem,
)
```

#### `storageEffect`

A Recoil atom effect that performs the persistence.

If you don't want to use the atom wrapper for some reason, you can use this instead.

`storageEffect` accepts three parameters:

- `key` The key that the data is stored under in the storage system.
- `storage` (Optional) Allows you to provide a custom storage system to persist state in.
- `validator` (Optional) A function to check that the data from Storage is valid.

**We don't perform any validation on the returned string from storage.** Please do this yourself via the `validator` parameter as users can easily edit LocalStorage and SessionStorage.

##### Examples

```ts
// Stores the value of state in LocalStorage under `my-state-in-LS` key
atom<StateType>({
  key: 'myState',
  default: { data: null },
  effects_UNSTABLE: [storageEffect<StateType>('my-state-in-LS')],
})

// Stores the value of state in SessionStorage under `my-state2-in-SS` key
atom<StateType>({
  key: 'myState2',
  default: { data: null },
  effects_UNSTABLE: [storageEffect<StateType>('my-state2-in-SS', myStorageSystem)],
})

// Stores the value of state in storage under `my-state3-in-SS` key
atom<StateType>({
  key: 'myState3',
  default: { data: null },
  effects_UNSTABLE: [
    storageEffect<StateType>(
      'my-state3-in-SS',
      undefined, // Use `@react-native-async-storage/async-storage`
      data => data !== null, // Won't load the data if it's equal to null
    ),
  ],
})
```
