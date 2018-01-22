(() => {
    const cLog = mes => console.log(`[GCP Console Colorize]: ${mes}`);
    safari.application.addEventListener('message', messageEvent => {
        if (messageEvent.name === 'getKeyPhrases') {
            const keyPhrases = safari.extension.settings.keyPhrases;
            messageEvent.target.page.dispatchMessage('keyPhrases', keyPhrases);
        }
    });
})();
