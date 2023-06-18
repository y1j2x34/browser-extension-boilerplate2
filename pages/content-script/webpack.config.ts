import { merge } from 'webpack-merge';
import path from 'node:path';
import {config} from "@vgerbot/browser-extension-builder";

export default merge(config({
    context: __dirname,
    releaseDirName: 'content'
}), {
    name: 'content',
    target: 'web',
    entry: path.resolve(__dirname, "src/index.ts"),
    output: {
        path: path.resolve(__dirname, "dist")
    }
})
