"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prototypes_1 = require("./prototypes");
const request_1 = require("./request");
class X {
    static text(url, options) {
        return prototypes_1.XText(url, options);
    }
    static json(url, options) {
        return prototypes_1.XJson(url, options);
    }
    static proto(url, options) {
        return prototypes_1.XProto(url, options);
    }
    static abort(request) {
        if (request instanceof request_1.XRequest) {
            request.abort();
        }
    }
    static isPending(request) {
        if (request instanceof request_1.XRequest) {
            return request.isPending();
        }
        return false;
    }
    static new() {
        return new request_1.XRequest();
    }
}
exports.default = X;
var request_2 = require("./request");
exports.XRequest = request_2.XRequest;
exports.XOptions = request_2.XOptions;
//# sourceMappingURL=index.js.map