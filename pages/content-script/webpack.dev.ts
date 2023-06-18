import { default as baseConfig } from './webpack.config'
import { merge } from 'webpack-merge';
import 'webpack-dev-server';

export default merge(baseConfig, {
    mode: 'development',
    devtool: 'inline-source-map',
    watch: true,
    devServer: {
        port: process.env.PORT,
        client: {
            logging: "warn",
            overlay:  {
                errors: true,
                warnings: false,
                runtimeErrors: false
            }
        }
    }
});