'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class XOptions {
    constructor(url, method = "GET", rt = "text", timeout) {
        this.url = url;
        this.method = method;
        this.responseType = rt;
        this.timeout = timeout;
        this.headers = {};
        this.requestedWith = true;
    }
}
class XRequest {
    constructor() {
        this.xhr = new XMLHttpRequest();
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
        this.convert = (d) => {
            return d;
        };
    }
    open(opts) {
        if (!opts.hasOwnProperty('url'))
            throw "Missing 'url' Parameter";
        let method = opts.method;
        this.xhr.open(method, opts.url);
        this.xhr.responseType = opts.responseType;
        this.xhr.onreadystatechange = this.__handleReadyStateChange.bind(this);
        if (typeof opts.timeout === "number") {
            this.xhr.timeout = opts.timeout;
            this.xhr.ontimeout = this.__handleTimeout();
        }
    }
    isPending() {
        switch (this.xhr.readyState) {
            case 0:
            case 4: return false;
            default: return true;
        }
    }
    setHeader(k, v) {
        this.xhr.setRequestHeader(k, v);
    }
    getPromise() {
        return this.promise;
    }
    getResponse() {
        return this.response;
    }
    getError() {
        return this.error;
    }
    getStatus() {
        return this.status;
    }
    hasError() {
        return this.error !== undefined;
    }
    send(data) {
        if (data === undefined)
            return this.xhr.send();
        return this.xhr.send(data);
    }
    abort() {
        if (this.xhr.readyState === 4 || this.xhr.readyState === 0)
            return;
        return this.xhr.abort();
    }
    __handleReadyStateChange() {
        switch (this.xhr.readyState) {
            case XMLHttpRequest.DONE: return this.__handleDone();
        }
    }
    __handleDone() {
        if (this.xhr.status === 200)
            return this.__handleSuccess();
        if (this.xhr.status === 0)
            return this.__handleAborted();
        return this.__handleError();
    }
    __handleSuccess() {
        switch (this.xhr.responseType) {
            case "arraybuffer":
                let buffer = this.xhr.response;
                if (buffer) {
                    this.response = this.convert(new Uint8Array(buffer), this);
                    this.status = this.xhr.status;
                }
                else {
                    this.response = this.convert(new Uint8Array(0), this);
                    this.status = this.xhr.status;
                }
                this.onSuccess();
                break;
            case "json":
                this.response = this.convert(this.xhr.response, this);
                this.status = this.xhr.status;
                this.onSuccess();
                break;
            default:
                this.response = this.convert(this.xhr.responseText, this);
                this.status = this.xhr.status;
                this.onSuccess();
                break;
        }
    }
    __handleError() {
        this.error = this.xhr.response;
        this.status = this.xhr.status;
        this.onError();
    }
    __handleAborted() {
        this.error = "aborted";
        this.status = 0;
        this.onAbort();
    }
    __handleTimeout() {
        this.error = "timeout";
        this.status = this.xhr.status;
        this.onTimeout();
    }
    onSuccess() {
        this.resolve(this);
    }
    onError() {
        this.reject(this);
    }
    onAbort() {
        this.reject(this);
    }
    onTimeout() {
        this.reject(this);
    }
}

function isBinarySerializer(object) {
    return 'serializeBinary' in object && typeof object.serializeBinary === "function";
}

function XText(url, options) {
    let request = new XRequest();
    let opts = Object.create(options);
    opts.url = url;
    let data = opts.data ? opts.data : undefined;
    if (opts.data !== null && opts.data !== undefined) {
        opts.method = "POST";
    }
    request.open(opts);
    setTextHeaders(request, opts);
    setHeaders(request, opts);
    setFunctionOverrides(request, opts);
    request.send(data);
    return request;
}
function XJson(url, options) {
    let request = new XRequest();
    let opts = Object.create(options);
    opts.url = url;
    opts.responseType = "json";
    let data = opts.data ? opts.data : undefined;
    if (opts.data !== null && opts.data !== undefined) {
        opts.method = "POST";
    }
    request.open(opts);
    setJSONHeaders(request, opts);
    setHeaders(request, opts);
    setFunctionOverrides(request, opts);
    request.send(data);
    return request;
}
function XProto(url, options) {
    let request = new XRequest();
    let opts = Object.create(options);
    opts.url = url;
    opts.responseType = "arraybuffer";
    let data = opts.data ? opts.data : undefined;
    if (opts.data !== null && opts.data !== undefined) {
        opts.method = "POST";
    }
    request.open(opts);
    setProtoHeaders(request, opts);
    setHeaders(request, opts);
    setProtoConvert(request, opts);
    setFunctionOverrides(request, opts);
    if (isBinarySerializer(data)) {
        request.send(data.serializeBinary());
    }
    else {
        request.send(data);
    }
    return request;
}
function setHeaders(request, options) {
    if (options.hasOwnProperty('headers'))
        return;
    for (let key in options.headers) {
        request.setHeader(key, options.headers[key]);
    }
}
function setXRequestedWithHeader(request, options) {
    if (!options.hasOwnProperty('requestedWith') || options.requestedWith) {
        request.setHeader("X-Requested-With", "XMLHttpRequest");
    }
}
function setTextHeaders(request, options) {
    setXRequestedWithHeader(request, options);
    request.setHeader("Content-Type", "text/plain");
}
function setJSONHeaders(request, options) {
    setXRequestedWithHeader(request, options);
    request.setHeader("Content-Type", "application/json");
}
function setProtoHeaders(request, options) {
    setXRequestedWithHeader(request, options);
    request.setHeader("Content-Types", "application/octet-stream");
}
function setFunctionOverrides(request, options) {
    if (options.hasOwnProperty('convert'))
        request.convert = options.convert;
}
function setProtoConvert(request, options) {
    if (!options.hasOwnProperty('proto'))
        request.convert = buildProtoConvert(options.proto);
}
function buildProtoConvert(proto) {
    return function (data) {
        return proto.deserializeBinary(data);
    };
}

class X {
    static text(url, options) {
        return XText(url, options);
    }
    static json(url, options) {
        return XJson(url, options);
    }
    static proto(url, options) {
        return XProto(url, options);
    }
    static abort(request) {
        if (request instanceof XRequest) {
            request.abort();
        }
    }
    static isPending(request) {
        if (request instanceof XRequest) {
            return request.isPending();
        }
        return false;
    }
    static new() {
        return new XRequest();
    }
}

exports['default'] = X;
exports.XRequest = XRequest;
exports.XOptions = XOptions;
//# sourceMappingURL=index.cjs.js.map
