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
            const header = document.querySelector(headerSelector);
            if (!header) {
                return;
            }
            const projectName = header.querySelector(projectNameSelector);
            if (!projectName){
                return;
            }
            const projectNameValue = projectName.textContent;
            const useRegexp = !!options.useRegexp;
            let phrases;
            try {
                phrases = JSON.parse(options.phrases);
            } catch (e) {
                phrases = [];
            }
            phrases.some(phrase => {
                const text = phrase.text.trim();
                const toColorize = useRegexp ? RegExp(text).test(projectNameValue) : projectNameValue.indexOf(text) !== -1;
                header.style.backgroundColor = toColorize ? phrase.color : blue;
                return toColorize;
            });
        }),
        1000);
})();
