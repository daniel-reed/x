import Request from './Request'

export default class x {
    static text(url, options) {
        let request = new Request();
        let opts = {type: "POST", url: url}
        Object.assign(opts, options);
        request.open(opts);

        x.setTextHeaders(request);
        x.setHeaders(request, opts);
        x.setFunctionOverrides(request, opts);

        let data = opts.hasOwnProperty('data') ? opts.data : undefined;
        request.send(data);
    }

    static json(url, options) {
        let request = new Request();
        let opts = {type: "POST", url: url, responseType: "json"}
        Object.assign(opts, options);
        request.open(opts);

        x.setJSONHeaders(request);
        x.setHeaders(request, opts);
        x.setFunctionOverrides(request, opts);

        let data = opts.hasOwnProperty('data') ? JSON.stringify(opts.data) : undefined;
        request.send(data);
    }

    static setJSONHeaders(request) {
        request.setHeader("X-Requested-With", "XMLHttpRequest");
        request.setHeader("Content-Type", "application/json");
    }

    static setTextHeaders(request) {
        request.setHeader("X-Requested-With", "XMLHttpRequest");
        request.setHeader("Content-Type", "text/plain");
    }

    static setHeaders(request, options) {
        if (options.hasOwnProperty('headers')) return;

        for (let key in options.headers) {
            if (!options.headers.hasOwnProperty(key)) continue;
            request.setHeader(key, options.headers[key]);
        }
    }

    static setFunctionOverrides(request, options) {
        if (options.hasOwnProperty('convert')) request.convert = options.convert;
        if (options.hasOwnProperty('success')) request.success = options.success;
        if (options.hasOwnProperty('error')) request.error = options.error;
        if (options.hasOwnProperty('aborted')) request.aborted = options.aborted;
        if (options.hasOwnProperty('timeout')) request.timeout = options.timeout;
    }

    static isPending(request) {
        if (request === null) return false;
        if (request === undefined) return false;
        if (!request.hasOwnProperty('isPending')) return false;
        return request.isPending();
    }

    static abort(request) {
        if (request === null) return;
        if (request === undefined) return;
        if (!request.hasOwnProperty('abort')) return;
        return request.abort();
    }
}

