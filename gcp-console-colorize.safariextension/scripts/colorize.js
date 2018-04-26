(() => {
    const targetHost = 'console.cloud.google.com';
    if (window.top !== window || window.location.host !== targetHost) {
        return;
    }
    const white = 'rgb(255, 255, 255)';
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
            if (phrases.length === 0) {
                projectName.style.color = white;
                header.style.backgroundColor = blue;
                return;
            }
            phrases.some(phrase => {
                const text = phrase.text.trim();
                const toColorize = useRegexp ? RegExp(text).test(projectNameValue) : projectNameValue.indexOf(text) !== -1;
                projectName.style.color = toColorize ? phrase.fgColor : white;
                header.style.backgroundColor = toColorize ? phrase.bgColor : blue;
                return toColorize;
            });
        }),
        200);
})();
