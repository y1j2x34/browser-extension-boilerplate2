import path from "path";
import { merge } from 'webpack-merge';
import {config} from "@vgerbot/browser-extension-builder/webpack.common";

export default merge(config({
    context: __dirname,
    releaseDirName: 'background'
}), {
    name: 'background',
    target: 'web',
    entry: path.resolve(__dirname, "src/index.ts")
})