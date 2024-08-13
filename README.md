# @eik/esbuild-plugin

[esbuild](https://esbuild.github.io/) plugin for [build-time import mapping with Eik](https://eik.dev/docs/guides/esbuild).

## Installation

```bash
npm install --save-dev esbuild @eik/esbuild-plugin
```

## Usage

```js
import * as eik from "@eik/esbuild-plugin";
import esbuild from "esbuild";

const options = /** @type {esbuild.BuildOptions}*/ ({
	entryPoints: ["./src/index.js"],
	outdir: "./public",
	format: "esm",
	platform: "browser",
	target: ["es2017"],
	bundle: true,
	sourcemap: true,
});

const watch = process.argv.includes("--dev");
if (watch) {
	let ctx = await esbuild.context(options);
	await ctx.watch();
	console.log("[esbuild] watching...");
} else {
	// Use the Eik plugin to to import mapping for the production build
	// Load the import maps listed in eik.json from the Eik server
	await eik.load();
	await esbuild.build({
		...options,
		plugins: [eik.plugin()],
	});
}
```

## API

This module has the following API:

### .load(options)

Loads an Eik configuration or import maps directly for the plugn to use to apply.

| option | default        | type     | required | details                                 |
| ------ | -------------- | -------- | -------- | --------------------------------------- |
| path   | `cwd/eik.json` | `string` | `false`  | Path to eik.json file.                  |
| urls   | `[]`           | `array`  | `false`  | Array of import map URLs to fetch from. |
| maps   | `[]`           | `array`  | `false`  | Array of import map as objects.         |

The plugin will attempt to read a `eik.json` from the current working directory of the Node.js process.

```js
await eik.load();
```

The path to the location of an `eik.json` file can be specified with the `path` option.

```js
await eik.load({
	path: "/path/to/eik.json",
});
```

The plugin can also load import maps directly from one or multiple URLs using the `urls` option.

```js
await eik.load({
	urls: ["http://myserver/import-maps/map.json"],
});
```

Additionally, individual import maps can be specified using the `maps` option.

```js
await eik.load({
	maps: [
		{
			imports: {
				"lit-element": "https://cdn.eik.dev/lit-element/v2",
			},
		},
	],
});
```

If several of these options are used, `maps` takes precedence over `urls` which takes precedence over values loaded from an `eik.json` file.

ie. in the following example

```js
await eik.load({
	path: "/path/to/eik.json",
	urls: ["http://myserver/import-maps/map.json"],
	maps: [
		{
			imports: {
				"lit-element": "https://cdn.eik.dev/lit-element/v2",
			},
		},
	],
});
```

Any import map URLs in `eik.json` will be loaded first, then merged with (and overridden if necessary by) the result of fetching from `http://myserver/import-map` before finally being merged with (and overriden if necessary by) specific mappings defined in `maps`. (In this case `lit-element`)

### .plugin()

Returns the plugin which will apply the loaded import maps during build. The returned plugin should be appended to the esbuild plugin array.

```js
import * as eik from "@eik/esbuild-plugin";
import esbuild from "esbuild";

await eik.load();

esbuild
	.build({
		entryPoints: ["src/main.js"],
		bundle: true,
		format: "esm",
		minify: false,
		sourcemap: false,
		target: ["es2017"],
		plugins: [eik.plugin()],
		outfile: "out.js",
	})
	.catch(() => process.exit(1));
```

### .clear()

Clears the loaded import maps from the plugins internal cache.
