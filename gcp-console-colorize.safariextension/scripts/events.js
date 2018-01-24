(() => {
    const init = funcMap => {
        if (!Utils.isGlobal) {
            return;
        }
        safari.application.addEventListener('message', event => {
            if (!event.target.page) {
                return;
            }
            if (event.name !== 'request') {
                Utils.log('unmatched request name', event);
                throw `unmatched request name: ${event.name}`;
            }
            const request = JSON.parse(event.message);
            const response = data => event.target.page.dispatchMessage(
                'request-response',
                JSON.stringify({
                    requestID: request.requestID,
                    response: data
                }));
            for (const name in funcMap) {
                if (request.action === name) {
                    funcMap[name](request, response);
                    break;
                }
            }
        });
    };

    const callbackPool = {};
    if (!Utils.isGlobal) {
        safari.self.addEventListener('message', event => {
            if (event.name !== 'request-response') {
                return;
            }
            const data = JSON.parse(event.message);
            if (data.requestID && callbackPool[data.requestID]) {
                callbackPool[data.requestID](data.response);
                delete callbackPool[data.requestID];
            }
        });
    }
    const call = (request, callback) => {
        if (callback) {
            const requestID = Math.random();
            callbackPool[requestID] = callback;
            request.requestID = requestID;
        }
        safari.self.tab.dispatchMessage('request', JSON.stringify(request));
    };

    this.Events = {
        init: init,
        call: call
    };
}).call(() => this || typeof window !== 'undefined' ? window : global);
