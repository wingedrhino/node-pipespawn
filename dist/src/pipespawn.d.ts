/// <reference types="node" />
/// <reference types="node" />
/**
 * SpawnOptions encapsulates the options for a pipespawn call.
 */
export interface SpawnOptions {
    useTmpDir?: boolean;
    workingDir?: string;
    inFile?: string;
    outFile?: string;
}
/**
 * canAccessLocatoin checks if the directory/file exists and is accessible.
 * @param pathToLocation string
 * @returns boolean
 */
export declare function canAccessLocation(pathToLocation: string): Promise<boolean>;
export declare function pipespawnToBuffer(input: NodeJS.ReadableStream | Buffer, command: string, options?: SpawnOptions): Promise<Buffer>;
export declare function pipespawnToStream(input: NodeJS.ReadableStream | Buffer, command: string, options?: SpawnOptions): Promise<NodeJS.ReadableStream>;
export declare const pipespawn: {
    toBuffer: typeof pipespawnToBuffer;
    toStream: typeof pipespawnToStream;
};
//# sourceMappingURL=pipespawn.d.ts.map