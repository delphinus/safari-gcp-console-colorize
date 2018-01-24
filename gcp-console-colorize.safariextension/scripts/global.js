Events.init({
    'get-options': (request, response) => {
        response(safari.extension.settings);
    }
});
