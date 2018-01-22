import { XRequest } from "./request";
export function isBinarySerializer(object) {
    return 'serializeBinary' in object && typeof object.serializeBinary === "function";
}
export function isBinaryDeserializer(object) {
    return 'deserializeBinary' in object && typeof object.deserializeBinary === "function";
}
export function XText(url, options) {
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
export function XJson(url, options) {
    let request = new XRequest();
    let opts = Object.create(options);
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
export function XProto(url, options) {
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
//# sourceMappingURL=prototypes.js.map