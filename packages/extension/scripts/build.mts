#!/usr/bin/env -S npx ts-node --esm --transpile-only --compilerOptions '{"moduleResolution":"nodenext","module":"esnext","target":"esnext"}'

import 'zx/globals'

const isDevelopment = argv.dev === true;

(async () => {
    try {
        await $$`npx cross-env RELEASE_PATH=$(pwd)/dist NODE_ENV=${isDevelopment ? 'development' : 'production'} webpack -c ./scripts/webpack.build.js --stats-error-details`
    } catch(e) {}
})()


async function $$(pieces: TemplateStringsArray, ...args) {
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
