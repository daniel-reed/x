import { XJson, XText, XProto } from "./prototypes";
import { XRequest } from "./request";
export default class X {
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
export { XRequest, XOptions } from "./request";
//# sourceMappingURL=index.js.map