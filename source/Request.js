export default class Request {
    constructor() {
        this.xhr = new XMLHttpRequest();
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

    success = function (response, _this) {}

    error = function (response, _this , status) {}

    aborted = function (_this) {}

    timeout = function (_this) {}
}