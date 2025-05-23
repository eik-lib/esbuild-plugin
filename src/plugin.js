import * as importMapPlugin from "esbuild-plugin-import-map";
import { helpers } from "@eik/common";

/**
 * @typedef {object} ImportMap
 * @property {Record<string, string>} imports
 */

/**
 * @typedef {object} LoadOptions
 * @property {string} [path=process.cwd()]
 * @property {string[]} [urls=[]] URLs to import maps hosted on an Eik server. Takes precedence over `eik.json`.
 * @property {ImportMap[]} [maps=[]] Inline import maps that should be used. Takes precedence over `urls` and `eik.json`.
 */

/**
 * Loads an Eik configuration or import maps directly for the plugn to use.
 * Call before building.
 *
 * @param {LoadOptions} options
 * @returns {Promise<void>}
 * @example
 * ```js
 * import * as eik from "@eik/esbuild-plugin";
 * import esbuild from "esbuild";
 *
 * await eik.load();
 * await esbuild.build({
 *   plugins: [eik.plugin()],
 * });
 * ```
 */
export async function load({
	path = process.cwd(),
	maps = [],
	urls = [],
} = {}) {
	const pMaps = Array.isArray(maps) ? maps : [maps];
	const pUrls = Array.isArray(urls) ? urls : [urls];

	const config = helpers.getDefaults(path);

	const fetched = await helpers.fetchImportMaps([...config.map, ...pUrls]);
	const mappings = fetched.concat(pMaps);

	await importMapPlugin.load(mappings);
}

/**
 * Clear the loaded import maps from the plugins internal cache.
 *
 * @returns {void}
 */
export function clear() {
	importMapPlugin.clear();
}

/**
 * @typedef {object} Plugin
 * @property {string} name
 * @property {(build: any) => void} setup
 */

/**
 * Returns the plugin which will apply the loaded import maps during build.
 *
 * @returns {Plugin}
 * @example
 * ```js
 * import * as eik from "@eik/esbuild-plugin";
 * import esbuild from "esbuild";
 *
 * await eik.load();
 * await esbuild.build({
 *   plugins: [eik.plugin()],
 * });
 * ```
 */
export function plugin() {
	const obj = importMapPlugin.plugin();
	obj.name = "@eik/esbuild-plugin";
	return obj;
}
