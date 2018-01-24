Events.init({
    'get-options': (request, response) => response(safari.extension.settings),
    'set-options': (request, response) => {
        if (!request.options) {
            return;
        }
        for (const key in request.options) {
            safari.extension.settings[key] = request.options[key];
        }
    }
});

safari.extension.secureSettings.addEventListener('change', event => {
    if (event.key === 'open_settings') {
        const newTab = safari.application.activeBrowserWindow.openTab();
        newTab.url = safari.extension.baseURI + 'settings.html';
    }
});
