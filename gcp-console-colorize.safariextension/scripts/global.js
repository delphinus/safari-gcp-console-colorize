(() => {
    const keyPhrases = safari.extension.settings.keyPhrases;
    safari.application.addEventListener('message', messageEvent => {
        if (messageEvent.name === 'getKeyPhrases') {
            messageEvent.target.page.dispatchMessage('keyPhrases', keyPhrases);
        }
    });
})();
