#!/usr/bin/env -S npx ts-node --esm --transpile-only --compilerOptions '{"moduleResolution":"nodenext","module":"esnext","target":"esnext"}'

import 'zx/globals'
import watch from 'glob-watcher';
import { copy, remove } from 'fs-extra';
import {resolve} from "node:path";
import debounce from "lodash.debounce";
import exports from "webpack";
import require = exports.RuntimeGlobals.require;


const isDevelopment = argv.dev === true;

const currentDir = path.dirname(import.meta.url).replace(/^file:\/+/, '/');

const publicDir = path.resolve(currentDir, "../public")
const distDir = resolve(currentDir, '../dist');

await remove(distDir);

if(isDevelopment) {
    watch(publicDir, function(done) {
        console.log('copy public');
        copyPublicDir().then(done, done);
    });
}
await copyPublicDir();

function copyPublicDir() {
    return copy(publicDir, path.resolve(currentDir, '../dist/public'), {
        overwrite: true,
        dereference: true
    })
}

(async () => {
    if(isDevelopment) {
        $$`npm run build:manifest -- --dev`;
    }
    try {
        await $$`npx cross-env RELEASE_PATH=$(pwd)/dist NODE_ENV=${isDevelopment ? 'development' : 'production'} webpack -c ./scripts/webpack.build.js --stats-error-details`;
        await $`npm run build:manifest`;
    } catch(e) {}
})()

import http from 'node:http';

if(isDevelopment) {
    let tick = 0;
    const server = http.createServer((req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);
        res.end(JSON.stringify({
            tick
        }));
    });
    const port = process.env.AUTO_RELOAD_PORT;
    server.listen(port, () => {
        console.log('Extension reloader server listening on port:', port)
    });
    const onchange = debounce(() => {
        tick ++;
        console.log('Changes detected', tick);
    }, 1000);
    watch(distDir, {}).on('change', () => {
        onchange();
    })
}


async function $$(pieces: TemplateStringsArray, ...args: any[]) {
    const result = pieces.reduce((left, cur, i) => {
        return left + args[i - 1] + (cur || '');
    });
    try {
        return await $([result, ''] as unknown as TemplateStringsArray, ['']);
    } finally {
        if(global.gc) {
            global.gc();
        }
    }
}
