import * as importMapPlugin from "esbuild-plugin-import-map";
import { helpers } from "@eik/common";

/**
 * @typedef {object} ImportMap
 * @property {Record<string, string>} imports
 */

/**
 * @param {string[]} urls
 * @returns {Promise<ImportMap[]>}
 */
const fetchImportMaps = async (urls = []) => {
	try {
		const maps = urls.map(async (map) => {
			const response = await fetch(map);

			if (response.status === 404) {
				throw new Error("Import map could not be found on server");
			} else if (response.status >= 400 && response.status < 500) {
				throw new Error("Server rejected client request");
			} else if (response.status >= 500) {
				throw new Error("Server error");
			}

			return /** @type {Promise<ImportMap>} */ (response.json());
		});
		return await Promise.all(maps);
	} catch (err) {
		throw new Error(
			`Unable to load import map file from server: ${err.message}`,
		);
	}
};

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

	const config = await helpers.getDefaults(path);

	const fetched = await fetchImportMaps([...config.map, ...pUrls]);
	const mappings = pMaps.concat(fetched);

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
