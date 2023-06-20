import path from "path";
import {config} from "@vgerbot/browser-extension-builder/webpack.common";

export default config({
    context: __dirname,
    releaseDirName: 'background'
}, {
    name: 'background',
    target: 'web',
    entry: [path.resolve(__dirname, "src/index.ts")]
})