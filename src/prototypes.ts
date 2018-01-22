import {XRequest, XOptions} from "./request";

export interface BinarySerializer {
    serializeBinary: () => Uint8Array;
}

export function isBinarySerializer(object: any): object is BinarySerializer {
    return 'serializeBinary' in object && typeof object.serializeBinary === "function";
}

export interface BinaryDeserializer {
    deserializeBinary: (d: Uint8Array | string) => any;
}

export function isBinaryDeserializer(object: any): object is BinaryDeserializer {
    return 'deserializeBinary' in object && typeof object.deserializeBinary === "function";
}

export function XText(url: string, options: XOptions): XRequest {
    let request: XRequest = new XRequest();
    let opts: XOptions = Object.create(options);
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

export function XJson(url: string, options: XOptions): XRequest {
    let request: XRequest = new XRequest();
    let opts: XOptions = Object.create(options);
    opts.url = url;

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

export function XProto(url: string, options: XOptions): XRequest {
    let request: XRequest = new XRequest();
    let opts: XOptions = Object.create(options);
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
        request.send(data.serializeBinary())
    } else {
        request.send(data);
    }

    return request;
}

function setHeaders(request: XRequest, options: XOptions) {
    if (options.hasOwnProperty('headers')) return;

    for (let key in options.headers) {
        request.setHeader(key, options.headers[key]);
    }
}

function setXRequestedWithHeader(request: XRequest, options: XOptions) {
    if (!options.hasOwnProperty('requestedWith') || options.requestedWith) {
        request.setHeader("X-Requested-With", "XMLHttpRequest");
    }
}

function setTextHeaders(request: XRequest , options: XOptions) {
    setXRequestedWithHeader(request, options);
    request.setHeader("Content-Type", "text/plain");
}

function setJSONHeaders(request: XRequest, options: XOptions) {
    setXRequestedWithHeader(request, options);
    request.setHeader("Content-Type", "application/json");
}

function setProtoHeaders(request: XRequest, options: XOptions) {
    setXRequestedWithHeader(request, options);
    request.setHeader("Content-Types", "application/octet-stream");
}

function  setFunctionOverrides(request: XRequest, options: XOptions) {
    if (options.hasOwnProperty('convert')) request.convert = options.convert;
}

function setProtoConvert(request: XRequest, options: XOptions) {
    if (!options.hasOwnProperty('proto')) request.convert = buildProtoConvert(options.proto);
}

function buildProtoConvert(proto: BinaryDeserializer) {
    return function (data: Uint8Array): any {
        return proto.deserializeBinary(data);
    }
}