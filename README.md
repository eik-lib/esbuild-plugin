# @eik/esbuild-plugin

ESBuild plugin for loading import maps from a [Eik server](https://eik.dev/) and applying the mapping to ECMAScript modules in preparation for upload to the same server.

## Installation

```bash
$ npm install @eik/esbuild-plugin
```

## Usage

```js
import * as eik from '@eik/esbuild-plugin';
import esbuild from 'esbuild';

await eik.load();

await esbuild.build({
    entryPoints: ['./src/app.js'],
    bundle: true,
    format: 'esm',
    target: ['esnext'],
    plugins: [eik.plugin()],
});
```

## Description

This plugin will read a local Eik config file (`eik.json`) and download the import maps from the Eik server defined in the config. The downloaded import maps will then be applied to the ECMAScript modules being processed.

### Plugin result

Bundles will have bare imports mapped to absolute URLs. 

Ie. Something like this...

```js
import { LitElement, html, css } from "lit-element";
```

Will be mapped to something like this...

```js
import { LitElement, html, css } from "https://cdn.eik.dev/lit-element/v2";
```

## API

This module has the following API:

### .load(options)

Loads an Eik configuration or import maps directly for the plugn to use to apply.

| option  | default        | type     | required | details                                                     |
| ------- | -------------- | -------- | -------- | ----------------------------------------------------------- |
| path    | `cwd/eik.json` | `string` | `false`  | Path to eik.json file.                                      |
| urls    | `[]`           | `array`  | `false`  | Array of import map URLs to fetch from.                     |
| maps    | `[]`           | `array`  | `false`  | Array of import map as objects.                             |

The plugin will attempt to read a `eik.json` from the current working directory of the Node.js process.

```js
await eik.load();
```

The path to the location of an `eik.json` file can be specified with the `path` option.

```js
await eik.load({
    path: '/path/to/eik.json',
});
```

The plugin can also load import maps directly from one or multiple URLs using the `urls` option.

```js
await eik.load({
    urls: ['http://myserver/import-maps/map.json'],
});
```

Additionally, individual import maps can be specified using the `maps` option.

```js
await eik.load({
    maps: [{
        imports: {
            'lit-element': 'https://cdn.eik.dev/lit-element/v2',
        }
    }],
});
```

If several of these options are used, `maps` takes precedence over `urls` which takes precedence over values loaded from an `eik.json` file.

ie. in the following example

```js
await eik.load({
    path: '/path/to/eik.json',
    urls: ['http://myserver/import-maps/map.json'],
    maps: [{
        imports: {
            'lit-element': 'https://cdn.eik.dev/lit-element/v2',
        }
    }],
});
```

Any import map URLs in `eik.json` will be loaded first, then merged with (and overridden if necessary by) the result of fetching from `http://myserver/import-map` before finally being merged with (and overriden if necessary by) specific mappings defined in `maps`. (In this case `lit-element`)

### .plugin()

Returns the plugin which will apply the loaded import maps during build. The returned plugin should be appended to the ESBuild plugin array.

```js
import * as eik from '@eik/esbuild-plugin';
import esbuild from 'esbuild';

await eik.load();

esbuild.build({
    entryPoints: ['src/main.js'],
    bundle: true,
    format: 'esm',
    minify: false,
    sourcemap: false,
    target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
    plugins: [eik.plugin()],
    outfile: 'out.js',
}).catch(() => process.exit(1))
```

### .clear()

Clears the loaded import maps from the plugins internal cache. 

## License

Copyright (c) 2020 Finn.no

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
