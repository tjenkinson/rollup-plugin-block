[![npm version](https://badge.fury.io/js/rollup-plugin-block.svg)](https://badge.fury.io/js/rollup-plugin-block)

# rollup-plugin-block

Ensure certain files don't become part of the build.

## Why?

Sometimes you want to have separate builds for dev and production. You might use the [`replace`](https://github.com/rollup/rollup-plugin-replace) plugin to conditionally import certain files. This plugin lets you make sure that a file that is meant for one build isn't accidentally compiled into another.

## Example

In this example if the `__DEV_MODE__` check was missing, the non-dev build would fail because it would contain "debug-logger.devonly.js". With the `__DEV_MODE__` check "debug-logger.devonly.js" would be omitted from the build by rollup given it's unused.

### main.js

```js
import { debugLogger } from './debug-logger.devonly.js';

if (__DEV_MODE__) {
  debugLogger.log('In dev mode.');
}
```

### debug-logger.devonly.js

```js
export const debugLogger = {
  log: (msg) => console.log(msg),
};
```

### rollup.config.js

```js
import rollupPluginBlock from 'rollup-plugin-block';
import replace from 'rollup-plugin-replace';

export default {
  input: 'main.js',
  plugins: [
    replace({
      __DEV_MODE__: JSON.stringify(!!process.env.DEV_BUILD),
    }),
    rollupPluginBlock({
      blockPattern: '.devonly.',
    }),
  ],
};
```

## Installation

```
npm install --save-dev rollup-plugin-block
```

## Usage

```js
import { rollup } from 'rollup';
const rollupPluginBlock = require('rollup-plugin-block');

export default {
  input: 'main.js',
  plugins: [
    rollupPluginBlock({
      blockPattern: '.devonly.' // or regex
    })
  ]
});
```
