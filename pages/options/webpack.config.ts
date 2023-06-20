import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import {config} from "@vgerbot/browser-extension-builder/webpack.common";

export default config({
    context: __dirname,
    releaseDirName: 'options'
}, {
    name: 'options',
    target: 'web',
    entry: [path.resolve(__dirname, "src/index.ts")],
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html')
        })
    ]
})