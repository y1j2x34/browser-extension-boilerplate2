import '@vgerbot/browser-extension-common/tailwind.css';

try {
    browser.devtools.panels.create('Dev Tools', 'icon-34.png', '/devtools/index.html');
} catch (e) {
    console.error(e);
}
