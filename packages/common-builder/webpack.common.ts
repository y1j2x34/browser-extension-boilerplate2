import { resolve } from 'node:path';
import {Configuration, WatchIgnorePlugin, SourceMapDevToolPlugin, webpack, ProvidePlugin} from 'webpack';
import { merge } from 'webpack-merge';
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ReactRefreshTypeScript from 'react-refresh-typescript';

export const mode = (process.env.NODE_ENV ?? 'development') as Configuration['mode'];
export const isProduction = mode === 'production';
export const isDevelopment = !isProduction;

const RELEASE_PATH = process.env.RELEASE_PATH

export type ExternalConfiguration = Omit<Configuration, 'entry'> & {
    entry?: string[];
};

export function config({
    context,
   releaseDirName
}: {
    context: string;
    releaseDirName: string
}, ...more: ExternalConfiguration[]): Configuration {
    return merge({
        mode,
        context,
        cache: {
            type: 'filesystem'
        },
        entry: [resolve(__dirname, './webextension-polyfill.js')],
        watch: isDevelopment,
        output: {
            path: RELEASE_PATH ? resolve(RELEASE_PATH, releaseDirName) : resolve(context, 'dist'),
            filename: 'index.js',
            // webpack process files in memory and because of that vsc can't resolve
            // source maps. The workaround is from
            // https://gist.github.com/jarshwah/389f93f2282a165563990ed60f2b6d6c
            devtoolModuleFilenameTemplate: isDevelopment ? 'file://[absolute-resource-path]' : undefined,
        },
        devtool: isDevelopment ? 'inline-source-map' : false,
        module: {
            rules: [{
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                        getCustomTransformers: () => ({
                            before: isDevelopment ? [ReactRefreshTypeScript()] : []
                        })
                    }
                }
            },
            (isProduction && {
                test: /\.js$/,
                exclude: /node_modules/,
                enforce: 'pre',
                use: 'source-map-loader'
            }), {
                test: /\.scss$/i,
                // https://stackoverflow.com/questions/55505894/webpack-mini-css-extract-plugin-not-outputting-css-file/60482491#60482491
                sideEffects: true,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false
                        }
                    },
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },{
                test: /\.css$/i,
                // https://stackoverflow.com/questions/55505894/webpack-mini-css-extract-plugin-not-outputting-css-file/60482491#60482491
                sideEffects: true,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false
                        }
                    },
                    'css-loader',
                    'postcss-loader'
                ]
            }, {
                test: /\.svg$/,
                type: 'asset/resource'
            }],
        },
        plugins: [
            new WatchIgnorePlugin({
                paths: [
                    /\.js$/,
                    /\.d\.ts$/,
                    /\.map$/
                ]
            }),
            new ForkTsCheckerWebpackPlugin(),
            isDevelopment && new ReactRefreshPlugin(),
            new MiniCssExtractPlugin({
                experimentalUseImportModule: true,
            }),
            isDevelopment && new SourceMapDevToolPlugin({
                // same as 'source-map'
                // https://stackoverflow.com/questions/52228650/configure-sourcemapdevtoolplugin-to-generate-source-map/55282204#55282204
                filename: '[file].map[query]',
                // TODO: set url for private deployment
                // TODO: probably better do that with sed while deployment
                // publicPath: 'https://api.example.com/project/',
            })
        ],
        optimization: {
            minimizer: [
                "...",
                isProduction && new CssMinimizerPlugin()
            ]
        },
        resolve: {
            extensions: [
                '.tsx', '.ts', '.js'
            ],
            fallback: {
                fs: false,
                buffer: false,
                stream: false,
                http: false,
                path: false,
                util: false,
                vm: false
            }
        }
    }, ...more);
}
