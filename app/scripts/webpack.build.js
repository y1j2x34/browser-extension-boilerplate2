require('sucrase/register/ts');

module.exports = [
    require('@vgerbot/browser-extension-content-script/webpack.config.ts'),
    require('@vgerbot/browser-extension-background/webpack.config.ts'),
    require('@vgerbot/browser-extension-devtools/webpack.config.ts'),
    require('@vgerbot/browser-extension-options/webpack.config.ts'),
    require('@vgerbot/browser-extension-popup/webpack.config.ts'),
].map(it => it.default)
