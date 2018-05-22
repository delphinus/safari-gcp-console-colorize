(() => {
    const targetHost = 'console.cloud.google.com';
    if (window.top !== window || window.location.host !== targetHost) {
        return;
    }
    const white = 'rgb(255, 255, 255)';
    const blue = 'rgb(59, 120, 231)';
    const selectors = [{
            header: '.p6n-system-bar',
            name: '.p6n-project-switcher-project-name'
        },
        {
            header: '.pcc-platform-bar-container',
            name: '.cfc-switcher-button-label'
        }
    ];
    window.setInterval(
        () => Events.call({
            action: 'get-options'
        }, options => {
            selectors.forEach(selector => {
                const header = document.querySelector(selector.header);
                if (!header) {
                    return;
                }
                const projectName = document.querySelector(selector.name);
                if (!projectName) {
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
            });
        }),
        200);
})();
