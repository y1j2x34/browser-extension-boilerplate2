(async () => {
    setInterval(async () => {
        const { tick: lastTick } = await browser.storage.local.get();
        const resp = await fetch('http://127.0.0.1:'+process.env.AUTO_RELOAD_PORT);
        const { tick } = await resp.json();
        if(lastTick !== tick) {
            await browser.storage.local.set({
                tick
            });
            browser.runtime.reload();
        }
    }, 5000);
})();
