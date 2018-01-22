export class XOptions {
    constructor(url, method = "GET", rt = "text", timeout) {
        this.url = url;
        this.method = method;
        this.responseType = rt;
        this.timeout = timeout;
        this.headers = {};
        this.requestedWith = true;
    }
}
export class XRequest {
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
//# sourceMappingURL=request.js.map