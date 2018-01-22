import { XOptions, XRequest } from "./request";
export default class X {
    static text(url: string, options: XOptions): XRequest;
    static json(url: string, options: XOptions): XRequest;
    static proto(url: string, options: XOptions): XRequest;
    static abort(request: any): void;
    static isPending(request: any): boolean;
    static new(): XRequest;
}
export { XRequest, XOptions } from "./request";
