#!/usr/bin/env -S npx ts-node --esm --transpile-only --compilerOptions '{"moduleResolution":"nodenext","module":"esnext","target":"esnext"}'

import 'zx/globals'
import watch from 'glob-watcher';
import { copy, remove } from 'fs-extra';
import {resolve} from "node:path";


const isDevelopment = argv.dev === true;

const currentDir = path.dirname(import.meta.url).replace(/^file:\/+/, '/');

const publicDir = path.resolve(currentDir, "../public")

await remove(resolve(currentDir, '../dist'));

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
