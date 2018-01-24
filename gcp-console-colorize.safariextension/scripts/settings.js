(() => {
    const start = options => {
        Utils.log(options);
        const keyPhrases = document.querySelector('[name=keyPhrases]');
        keyPhrases.setAttribute('value', options.keyPhrases);
        keyPhrases.addEventListener('change', event => {
            Utils.log('event', event);
            Events.call({
                action: 'set-options',
                options: {
                    keyPhrases: event.target.value
                }
            });
        });
    };
    Events.call({action: 'get-options'}, start);
})();
