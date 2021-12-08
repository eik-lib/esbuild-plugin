/* eslint-disable no-restricted-syntax */

import * as importMapPlugin from 'esbuild-plugin-import-map';
import fetch from 'node-fetch';
import { helpers } from '@eik/common';

async function fetchImportMaps(urls = []) {
    try {
        const maps = urls.map((map) => fetch(map).then((result) => {
            if (result.status === 404) {
                throw new Error('Import map could not be found on server');
            } else if (result.status >= 400 && result.status < 500) {
                throw new Error('Server rejected client request');
            } else if (result.status >= 500) {
                throw new Error('Server error');
            }
            return result.json();
        }));
        return await Promise.all(maps);
    } catch (err) {
        throw new Error(
            `Unable to load import map file from server: ${err.message}`,
        );
    }
}

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

export function clear() {
    importMapPlugin.clear();
}

export function plugin() {
    const obj = importMapPlugin.plugin();
    obj.name = '@eik/esbuild-plugin';
    return obj;
}
