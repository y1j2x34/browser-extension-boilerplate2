import { merge } from 'webpack-merge';
import path from 'node:path';
import { config } from "@vgerbot/browser-extension-builder";

export default merge(config({
    context: __dirname,
    releaseDirName: 'content-script'
}), {
    name: 'content-script',
    target: 'web',
    entry: path.resolve(__dirname, "src/index.ts")
})
