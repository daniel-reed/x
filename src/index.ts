import {XJson, XText, XProto} from "./prototypes";
import {XOptions, XRequest} from "./request";

export default class X {
    static text(url: string, options: XOptions): XRequest {
        return XText(url, options);
    }

    static json(url: string, options: XOptions): XRequest {
        return XJson(url, options)
    }

    static proto(url: string, options: XOptions): XRequest {
        return XProto(url, options)
    }

    static abort(request: any) {
        if (request instanceof XRequest) {
            request.abort();
        }
    }

    static isPending(request: any): boolean {
        if (request instanceof XRequest) {
            return request.isPending();
        }

        return false
    }

    static new(): XRequest {
        return new XRequest();
    }
}

export { XRequest, XOptions } from "./request";