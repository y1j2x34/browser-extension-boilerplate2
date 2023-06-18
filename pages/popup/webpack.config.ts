import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { merge } from 'webpack-merge';
import {config} from "@vgerbot/browser-extension-builder/webpack.common";

export default merge(config({
    context: __dirname,
    releaseDirName: 'popup'
}), {
    name: 'popup',
    target: 'web',
    entry: path.resolve(__dirname, "src/index.ts"),
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
        })
    ]
})