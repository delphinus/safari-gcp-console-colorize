(() => {
    const targetHost = 'console.cloud.google.com';
    if (window.top !== window || window.location.host !== targetHost) {
        return;
    }
    const red = 'rgb(218, 67, 54)';
    const blue = 'rgb(59, 120, 231)';
    const headerSelector = '.p6n-system-bar';
    const projectNameSelector = '.p6n-project-switcher-project-name';
    window.setInterval(
        () => Events.call({action: 'get-options'}, options => {
            const keyPhrases = options.keyPhrases;
            if (!keyPhrases) {
                return;
            }
            const header = document.querySelector(headerSelector);
            if (!header) {
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
            header.style.backgroundColor = toColorize ? red : blue;
        }),
        1000);
})();
