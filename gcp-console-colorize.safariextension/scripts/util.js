(() => {
    const log = mes => console.log(`[GCP Console Colorize]: ${mes}`);

    this.Util = {
        log: log
    };
}).call(() => this || typeof window !== 'undefined' ? window : global);
