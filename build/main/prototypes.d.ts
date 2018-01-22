import { XRequest, XOptions } from "./request";
export interface BinarySerializer {
    serializeBinary: () => Uint8Array;
}
export declare function isBinarySerializer(object: any): object is BinarySerializer;
export interface BinaryDeserializer {
    deserializeBinary: (d: Uint8Array | string) => any;
}
export declare function isBinaryDeserializer(object: any): object is BinaryDeserializer;
export declare function XText(url: string, options: XOptions): XRequest;
export declare function XJson(url: string, options: XOptions): XRequest;
export declare function XProto(url: string, options: XOptions): XRequest;
