#!/usr/bin/env -S npx ts-node --esm --transpile-only --compilerOptions '{"moduleResolution":"nodenext","module":"esnext","target":"esnext"}'

import 'zx/globals';
// import '../../../src/global';
import { createRequire } from 'node:module';
import watch from 'glob-watcher';
import { resolve } from "node:path";
import { existsSync } from "node:fs";

import merge from 'lodash.merge';
import path from "path";


const require = createRequire(import.meta.url);
const pkg = require('../package.json');
const isDevelopment = argv.dev === true;


const manifest: ManifestTypeV3 = {
    manifest_version: 3,
    name: pkg.displayName,
    version: pkg.version,
    description: pkg.description,
    icons: {
        '128': 'public/icon-128.png'
    },
    web_accessible_resources: [
        {
            resources: ['public/*', 'assets/*', 'content/*'],
            matches: ['<all_urls>']
        }
    ],
    externally_connectable: {
        matches: [ '*://127.0.0.1/*' ]
    },
    permissions: [
        'storage', 'tabs'
    ]
};

const distDir = path.resolve(path.dirname(import.meta.url).replace(/^file:\/+/, '/'), "../dist")

if(isDevelopment) {
    watch(distDir, {}).on("change", async (filename) => {
        if(filename.endsWith('manifest.json')) {
            return;
        }
        await writeManifest();
        console.log('manifest rewrite done');
    })
}

await writeManifest();

async function writeManifest() {
    if(!existsSync(distDir)) {
        return;
    }
    const partialManifest = await readPageMap(distDir);

    const finalManifest = merge({}, manifest, partialManifest);
    await fs.writeJSON(path.resolve(distDir, 'manifest.json'), finalManifest, {
        spaces: '  '
    });
}

async function readPageMap(distDir: string): Promise<Partial<ManifestTypeV3>> {
    const manifest: Partial<ManifestTypeV3> = {};
    const optionsDir = resolve(distDir, 'options');
    const backgroundDir = resolve(distDir, 'background');
    const existsOptions = await fs.exists(optionsDir)
    const existsBackground = await fs.exists(backgroundDir)
    const popupDir = resolve(distDir, 'popup')
    const newtabDir = resolve(distDir, 'newtab')
    const bookmarksDir = resolve(distDir, 'bookmarks')
    const historyDir = resolve(distDir, 'history')
    const devtoolsDir = resolve(distDir, 'devtools')
    const contentScriptDir = resolve(distDir, 'content-script');

    const existsPopup = await fs.exists(popupDir)
    const existsNewtab = await fs.exists(newtabDir)
    const existsBookmarks = await fs.exists(bookmarksDir)
    const existsHistory = await fs.exists(historyDir)
    const existsDevtools = await fs.exists(devtoolsDir)
    const existsContentScript = await fs.exists(contentScriptDir)

    exists_options:if(existsOptions) {
        const htmlFileName = await readExt(optionsDir, '.html')
        if(!htmlFileName) {
            break exists_options;
        }
        merge(manifest, {
            options_ui: {
                page: path.relative(distDir, path.resolve(optionsDir, htmlFileName))
            }
        });
    }
    exists_background:if(existsBackground) {
        const jsFileName = await readExt(backgroundDir, '.js')
        if(!jsFileName) {
            break exists_background;
        }
        merge(manifest, {
            background: {
                service_worker: path.relative(distDir, path.resolve(backgroundDir, jsFileName))
            }
        })
    }

    exists_popup:if(existsPopup) {
        const htmlFileName = await readExt(popupDir, '.html')
        if(!htmlFileName) {
            break exists_popup;
        }
        merge(manifest, {
            action: {
                default_popup: path.relative(distDir, path.resolve(popupDir, htmlFileName)),
                default_icon: 'public/icon-34.png'
            }
        });
    }

    exists_new_tab:if(existsNewtab) {
        const htmlFileName = await readExt(newtabDir, '.html')
        if(!htmlFileName) {
            break exists_new_tab;
        }
        merge(manifest, {
            chrome_url_overrides: {
                newtab: path.relative(distDir, path.resolve(newtabDir, htmlFileName))
            }
        })
    }

    exists_bookmarks:if(existsBookmarks) {
        const htmlFileName = await readExt(bookmarksDir, '.html')
        if(!htmlFileName) {
            break exists_bookmarks;
        }
        merge(manifest, {
            chrome_url_overrides: {
                bookmarks: path.relative(distDir, path.resolve(bookmarksDir, htmlFileName))
            }
        })
    }
    exists_history:if(existsHistory) {
        const htmlFileName = await readExt(historyDir, '.html')
        if(!htmlFileName) {
            break exists_history;
        }
        merge(manifest, {
            chrome_url_overrides: {
                history: path.relative(distDir, path.resolve(historyDir, htmlFileName))
            }
        })
    }
    exists_content_script:if(existsContentScript) {
        const jsFileName = await readExt(contentScriptDir, '.js')
        if(!jsFileName) {
            break exists_content_script;
        }
        const cssFileName = await readExt(contentScriptDir, 'webpage.css')
        merge(manifest, {
            content_scripts: [
                {
                    matches: ['http://*/*', 'https://*/*', '<all_urls>'],
                    js: [path.relative(distDir, path.resolve(contentScriptDir, jsFileName))],
                    css: cssFileName ? [path.relative(distDir, path.resolve(contentScriptDir, cssFileName))] : [],
                    run_at: 'document_start'
                }
            ]
        });
    }
    exists_devtools:if(existsDevtools) {
        const htmlFileName = await readExt(devtoolsDir, '.html');
        if(!htmlFileName) {
            break exists_devtools;
        }
        merge(manifest, {
            devtools_page: path.relative(distDir, path.resolve(devtoolsDir, htmlFileName))
        })
    }

    return manifest;
}

async function readExt(dir: string, ext: string) {
    const subdirs = await fs.readdir(dir);
    return subdirs.find(it => it.endsWith(ext));
}
