export default class x {
    static text(url, options) {
        let request = new Request();
        let opts = {type: "POST", url: url};
        Object.assign(opts, options);
        request.open(opts);

        x.setTextHeaders(request, opts);
        x.setHeaders(request, opts);
        x.setFunctionOverrides(request, opts);

        let data = opts.hasOwnProperty('data') ? opts.data : undefined;
        request.send(data);
    }

    static json(url, options) {
        let request = new Request();
        let opts = {type: "POST", url: url, responseType: "json"};
        Object.assign(opts, options);
        request.open(opts);

        x.setJSONHeaders(request, opts);
        x.setHeaders(request, opts);
        x.setFunctionOverrides(request, opts);

        let data = opts.hasOwnProperty('data') ? JSON.stringify(opts.data) : undefined;
        request.send(data);
    }

    static proto(url, options) {
        let request = new Request();
        let opts = {type: "POST", url: url, responseType: "json"};
        Object.assign(opts, options);
        request.open(opts);

        x.setProtoHeaders(request, opts);
        x.setHeaders(request, opts);
        x.setFunctionOverrides(request, opts);
        x.setProtoConvert(request, opts);

        let data;
        if (opts.hasOwnProperty('data') && opts.data.hasOwnProperty('serializeBinary')) {
            data = opts.data.serializeBinary();
        }
        request.send(data);
    }

    static setJSONHeaders(request, options) {
        x.setXRequestedWithHeader(request, options);
        request.setHeader("Content-Type", "application/json");
    }

    static setTextHeaders(request, options) {
        x.setXRequestedWithHeader(request, options);
        request.setHeader("Content-Type", "text/plain");
    }

    static setProtoHeaders(request, options) {
        x.setXRequestedWithHeader(request, options);
        request.setHeader("Content-Type", "application/octet-stream")
    }

    static setXRequestedWithHeader(request, options) {
        if (!options.hasOwnProperty('requestedWith') || options.requestedWith) {
            request.setHeader("X-Requested-With", "XMLHttpRequest");
        }
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

    static setProtoConvert(request, options) {
        if (!options.hasOwnProperty('proto')) return;
        request.convert = x.buildProtoConvert(options.proto);
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

    static buildProtoConvert(proto) {
        return function (data, _this) {
            return proto.deserializeBinary(data);
        }
    }
}

class Request {
    constructor() {
        this.xhr = new XMLHttpRequest();
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    open = (opts) => {
        if (!opts.hasOwnProperty('url')) throw "Missing 'url' Parameter";

        let type = opts.hasOwnProperty("type") ? opts.type : "GET";

        this.xhr.open(type, opts.url);

        if (opts.hasOwnProperty("responseType")) this.xhr.responseType = opts.responseType;
        this.xhr.onreadystatechange = this.__handleReadyStateChange;
        if (opts.hasOwnProperty("timeout")) {
            this.xhr.timeout = opts.timeout;
            this.xhr.ontimeout = this.__handleTimeout();
        }
    }

    isPending = () => {
        switch (this.xhr.readyState) {
            case 0: case 4: return false;
            default: return true;
        }
    }

    setHeader = (k, v) => {
        this.xhr.setRequestHeader(k, v);
    }

    getPromise = () => {
        return this.promise;
    }

    send = (data) => {
        if (data === undefined) return this.xhr.send();
        return this.xhr.send(data);
    }

    abort = () => {
        if (this.xhr.readyState === 4 || this.xhr.readyState === 0) return;
        return this.xhr.abort();
    }

    __handleReadyStateChange = () => {
        switch (this.xhr.readyState) {
            case XMLHttpRequest.DONE: return this.__handleDone();
        }
    }

    __handleDone = () => {
        if (this.xhr.status === 200) return this.__handleSuccess();
        if (this.xhr.status === 0) return this.__handleAborted();
        return this.__handleError();
    }

    __handleSuccess = () => {
        switch (this.xhr.responseType) {
            case "json":
                this.success(this.convert(this.xhr.response), this);
                break;
            default:
                this.success(this.convert(this.xhr.responseText), this);
                break;
        }
    }

    __handleError = () => {
        this.error(this.xhr.response, this, this.xhr.status)
    }

    __handleAborted = () => {
        this.aborted(this);
    }

    __handleTimeout = () => {
        this.timeout(this);
    }

    convert = function (data, _this) {return data;}

    success = function (response, _this) {
        _this.resolve(_this);
    }

    error = function (response, _this , status) {
        _this.reject(_this);
    }

    aborted = function (_this) {
        _this.reject(_this);
    }

    timeout = function (_this) {
        _this.reject(_this);
    }
}

