(() => {
    if (window.top !== window) {
        return;
    }
    const red = 'rgb(218, 67, 54)';
    const blue = 'rgb(59, 120, 231)';
    const headerSelector = '.p6n-system-bar';
    const projectNameSelector = '.p6n-project-switcher-project-name';
    const colorize = () => {
        safari.self.addEventListener('message', messageEvent => {
            if (messageEvent.name !== 'keyPhrases') {
                return;
            }
            const keyPhrases = messageEvent.message;
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
            const toColorize = keyPhrases.split(/,/).some((current, index, array) => {
                console.log(`current: ${current}`);
                return projectNameValue.indexOf(current) !== -1;
            });
            if (toColorize) {
                header.style.backgroundColor = red;
            } else {
                header.style.backgroundColor = blue;
            }
        });
        safari.self.tab.dispatchMessage('getKeyPhrases');
    };
    window.setInterval(colorize, 1000);
})();
