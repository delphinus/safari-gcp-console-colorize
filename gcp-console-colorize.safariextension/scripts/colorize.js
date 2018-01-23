(() => {
    const cLog = mes => console.log(`[GCP Console Colorize]: ${mes}`);
    const targetHost = 'console.cloud.google.com';
    if (window.top !== window || window.location.host !== targetHost) {
        return;
    }
    const red = 'rgb(218, 67, 54)';
    const blue = 'rgb(59, 120, 231)';
    const headerSelector = '.p6n-system-bar';
    const projectNameSelector = '.p6n-project-switcher-project-name';
    const colorize = keyPhrases => {
        if (!keyPhrases) {
            return;
        }
        const header = document.querySelector(headerSelector);
        if (!header || header.style.backgroundColor === red) {
            return;
        }
        const projectName = header.querySelector(projectNameSelector);
        if (!projectName){
            return;
        }
        const projectNameValue = projectName.textContent;
        const toColorize = keyPhrases.split(/,/)
            .map(phrase => phrase.trim())
            .some(phrase => projectNameValue.indexOf(phrase) !== -1);
        if (toColorize) {
            header.style.backgroundColor = red;
        }
    }
    safari.self.addEventListener('message', messageEvent => {
        if (messageEvent.name === 'keyPhrases') {
            colorize(messageEvent.message);
        }
    });
    window.setInterval(
        () => safari.self.tab.dispatchMessage('getKeyPhrases'),
        1000);
})();
