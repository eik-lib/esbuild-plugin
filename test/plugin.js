/* eslint-disable no-restricted-syntax */

import fastify from 'fastify';
import esbuild from 'esbuild';
import path from 'path';
import tap from 'tap';
import fs from 'fs';

import { __dirname } from '../utils/dirname.js';
import * as plugin from '../src/plugin.js';

const file = `${__dirname}/../fixtures/modules/file/main.js`;

/*
 * When running tests on Windows, the output code get some extra \r on each line.
 * Remove these so snapshots work on all OSes.
 */
const clean = (str) => str.split('\r').join('');

const bufferToString = (buff) => {
    const str = [];
    for (const out of buff) {
        str.push(new TextDecoder('utf-8').decode(out.contents));
    }
    return str.join('');
};

tap.test('plugin() - import map fetched from a URL', async (t) => {
    const server = fastify();
    server.get('/one', (request, reply) => {
        reply.send({
            imports: {
                'lit-element': 'https://cdn.eik.dev/lit-element/v2',
            },
        });
    });
    server.get('/two', (request, reply) => {
        reply.send({
            imports: {
                'lit-html': 'https://cdn.eik.dev/lit-html/v1',
            },
        });
    });
    const address = await server.listen();

    await plugin.load({
        maps: [{
            imports: {
                'lit-html/lit-html': 'https://cdn.eik.dev/lit-html/v2',
            },
        }],
        urls: [`${address}/one`, `${address}/two`],
    });

    const result = await esbuild.build({
        entryPoints: [file],
        bundle: true,
        format: 'esm',
        minify: false,
        sourcemap: false,
        target: ['esnext'],
        plugins: [plugin.plugin()],
        write: false,
    });

    const code = bufferToString(result.outputFiles);
    t.matchSnapshot(clean(code), 'import maps from urls');

    plugin.clear();
    await server.close();
    t.end();
});

tap.test('plugin() - import map fetched from a URL via eik.json', async (t) => {
    const server = fastify();
    server.get('/one', (request, reply) => {
        reply.send({
            imports: {
                'lit-element': 'https://cdn.eik.dev/lit-element/v2',
                'lit-html': 'https://cdn.eik.dev/lit-html/v1',
                'lit-html/lit-html': 'https://cdn.eik.dev/lit-html/v2',
            },
        });
    });
    const address = await server.listen();

    await fs.promises.writeFile(path.join(process.cwd(), 'eik.json'), JSON.stringify({
        name: 'test',
        version: '1.0.0',
        js: '',
        css: '',
        'import-map': `${address}/one`,
    }));

    await plugin.load();

    const result = await esbuild.build({
        entryPoints: [file],
        bundle: true,
        format: 'esm',
        minify: false,
        sourcemap: false,
        target: ['esnext'],
        plugins: [plugin.plugin()],
        write: false,
    });

    const code = bufferToString(result.outputFiles);
    t.matchSnapshot(clean(code), 'eik.json import-map string');

    plugin.clear();
    await server.close();
    await fs.promises.unlink(path.join(process.cwd(), 'eik.json'));
    t.end();
});

tap.test('plugin() - import maps via eik.json, URLs and direct definitions', async (t) => {
    const server = fastify();
    server.get('/one', (request, reply) => {
        reply.send({
            imports: {
                'lit-element': 'https://cdn.eik.dev/lit-element/v2',
            },
        });
    });
    server.get('/two', (request, reply) => {
        reply.send({
            imports: {
                'lit-html': 'https://cdn.eik.dev/lit-html/v1',
            },
        });
    });
    const address = await server.listen();

    await fs.promises.writeFile(path.join(process.cwd(), 'eik.json'), JSON.stringify({
        name: 'test',
        version: '1.0.0',
        js: '',
        css: '',
        'import-map': `${address}/one`,
    }));

    await plugin.load({
        maps: [{
            imports: {
                'lit-html/lit-html': 'https://cdn.eik.dev/lit-html/v2',
            },
        }],
        urls: [`${address}/two`],
    });

    const result = await esbuild.build({
        entryPoints: [file],
        bundle: true,
        format: 'esm',
        minify: false,
        sourcemap: false,
        target: ['esnext'],
        plugins: [plugin.plugin()],
        write: false,
    });

    const code = bufferToString(result.outputFiles);
    t.matchSnapshot(clean(code), 'import maps from eik.json, urls and direct definition');

    plugin.clear();
    await server.close();
    await fs.promises.unlink(path.join(process.cwd(), 'eik.json'));
    t.end();
});
