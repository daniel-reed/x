import {BinaryDeserializer} from "./prototypes";

export class XOptions {
    convert?: (d: Uint8Array | string, t: XRequest) => any;
    data?: any;
    proto?: BinaryDeserializer;
    timeout?: number;

    headers: { [s: string]: string; };
    method: string;
    responseType: XMLHttpRequestResponseType;
    requestedWith: boolean;
    url: string;

    constructor(url: string, method: string = "GET", rt:XMLHttpRequestResponseType = "text", timeout?: number) {
        this.url = url;
        this.method = method;
        this.responseType = rt;
        this.timeout = timeout;
        this.headers = {};
        this.requestedWith = true;
    }
}

export class XRequest {
    error?: any;
    response?: any;

    promise: Promise<XRequest>;
    convert: (d: Uint8Array | string, t: this) => any;
    resolve: Function;
    reject: Function;

    status: number;
    xhr: XMLHttpRequest;

    constructor() {
        this.xhr = new XMLHttpRequest();
        this.promise = new Promise((resolve: Function, reject: Function) => {
            this.resolve = resolve;
            this.reject = reject;
        });

        this.convert = (d: any): any => {
            return d;
        }
    }

    open(opts: XOptions): void {
        if (!opts.hasOwnProperty('url')) throw "Missing 'url' Parameter";

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
            case 0: case 4: return false;
            default: return true;
        }
    }

    setHeader(k: string, v: string): void {
        this.xhr.setRequestHeader(k, v);
    }

    getPromise(): Promise<XRequest> {
        return this.promise;
    }

    getResponse(): any {
        return this.response;
    }

    getError(): any {
        return this.error;
    }

    getStatus(): number {
        return this.status;
    }

    hasError(): boolean {
        return this.error !== undefined
    }

    send(data: any): void {
        if (data === undefined) return this.xhr.send();
        return this.xhr.send(data);

    }

    abort(): void {
        if (this.xhr.readyState === 4 || this.xhr.readyState === 0) return;
        return this.xhr.abort();
    }

    __handleReadyStateChange(): void {
        switch (this.xhr.readyState) {
            case XMLHttpRequest.DONE: return this.__handleDone();
        }
    }

    __handleDone(): void {
        if (this.xhr.status === 200) return this.__handleSuccess();
        if (this.xhr.status === 0) return this.__handleAborted();
        return this.__handleError();
    }

    __handleSuccess(): void {
        switch (this.xhr.responseType) {
            case "arraybuffer":
                let buffer = this.xhr.response;
                if (buffer) {
                    this.response = this.convert(new Uint8Array(buffer), this);
                    this.status = this.xhr.status;
                } else {
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

    __handleError(): void {
        this.error = this.xhr.response;
        this.status = this.xhr.status;
        this.onError()
    }

    __handleAborted(): void {
        this.error = "aborted";
        this.status = 0;
        this.onAbort();
    }

    __handleTimeout(): any {
        this.error = "timeout";
        this.status = this.xhr.status;
        this.onTimeout();
    }

    onSuccess(): void {
        this.resolve(this)
    }

    onError(): void {
        this.reject(this)
    }

    onAbort(): void {
        this.reject(this);
    }

    onTimeout(): void {
        this.reject(this);
    }
}