(() => {
    const log = (...mes) => console.log('[GCP Console Colorize]', ...mes);
    const isGlobal = typeof safari.application !== 'undefined';

    this.Utils = {
        log: log,
        isGlobal: isGlobal
    };
}).call(() => this || typeof window !== 'undefined' ? window : global);
