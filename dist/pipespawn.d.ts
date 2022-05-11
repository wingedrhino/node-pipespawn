/// <reference types="node" />
import { Readable } from 'node:stream';
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
export declare function pipespawnToBuffer(input: Readable, command: string, options?: SpawnOptions): Promise<Buffer>;
export declare function pipespawnToStream(input: Readable, command: string, options?: SpawnOptions): Promise<Readable>;
export declare const pipespawn: {
    toBuffer: typeof pipespawnToBuffer;
    toStream: typeof pipespawnToStream;
};
//# sourceMappingURL=pipespawn.d.ts.map