import { BinaryDeserializer } from "./prototypes";
export declare class XOptions {
    convert?: (d: Uint8Array | string, t: XRequest) => any;
    data?: any;
    proto?: BinaryDeserializer;
    timeout?: number;
    headers: {
        [s: string]: string;
    };
    method: string;
    responseType: XMLHttpRequestResponseType;
    requestedWith: boolean;
    url: string;
    constructor(url: string, method?: string, rt?: XMLHttpRequestResponseType, timeout?: number);
}
export declare class XRequest {
    error?: any;
    response?: any;
    promise: Promise<XRequest>;
    convert: (d: Uint8Array | string, t: this) => any;
    resolve: Function;
    reject: Function;
    status: number;
    xhr: XMLHttpRequest;
    constructor();
    open(opts: XOptions): void;
    isPending(): boolean;
    setHeader(k: string, v: string): void;
    getPromise(): Promise<XRequest>;
    getResponse(): any;
    getError(): any;
    getStatus(): number;
    hasError(): boolean;
    send(data: any): void;
    abort(): void;
    __handleReadyStateChange(): void;
    __handleDone(): void;
    __handleSuccess(): void;
    __handleError(): void;
    __handleAborted(): void;
    __handleTimeout(): any;
    onSuccess(): void;
    onError(): void;
    onAbort(): void;
    onTimeout(): void;
}
