import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { cwd } from 'node:process';
import { Readable } from 'node:stream';
import { access, unlink, readFile } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
/**
 * SpawnOptionsNonNullable is a version of SpawnOptions that does not contain
 * undefined values and instead is designed to hold default values.
 */
class SpawnOptionsImpl {
    useTmpDir = false;
    workingDir = '';
    inFile = '';
    outFile = '';
    constructor(options) {
        if (options === undefined || options === null) {
            options = {};
        }
        if (options.useTmpDir !== undefined) {
            this.useTmpDir = options.useTmpDir;
        }
        else {
            this.useTmpDir = false;
        }
        if (options.workingDir !== undefined) {
            this.workingDir = options.workingDir;
        }
        else {
            this.workingDir = '';
        }
        if (options.inFile !== undefined) {
            this.inFile = options.inFile;
        }
        else {
            this.inFile = '';
        }
        if (options.outFile !== undefined) {
            this.outFile = options.outFile;
        }
        else {
            this.outFile = '';
        }
    }
}
/**
 * canAccessLocatoin checks if the directory/file exists and is accessible.
 * @param pathToLocation string
 * @returns boolean
 */
export async function canAccessLocation(pathToLocation) {
    try {
        await access(pathToLocation);
        return true;
    }
    catch (err) {
        return false;
    }
}
/**
 * pipespawnImpl takes a Readable stream, and pipes it through an external
 * process via its stdin, and returns the stdout body as a Buffer.
 * If there was an error, it collects the stderr into a message Buffer,
 * and returns the non-zero exit code as the error name.
 * If SpawnOptions is provided, it will use the provided options to change the
 * behaviour a little, like setting a custom working directory, or using input
 * and output files instead of reading/writing from/to stdin/stdout.
 */
async function pipespawnImpl(input, command, spawnOptions) {
    // Start: split command from its arguments
    const [cmd, ...args] = command.split(' ');
    // ensure that a command WAS provided
    if (typeof cmd !== 'string') {
        throw new Error('pipespawn: command must be a string');
    }
    const options = new SpawnOptionsImpl(spawnOptions);
    // Set a working directory for the child process
    let workingDirectory = cwd();
    if (options.workingDir.length > 0) {
        workingDirectory = options.workingDir;
    }
    else if (options.useTmpDir) {
        workingDirectory = tmpdir();
    }
    // check if we have access to working directory
    if (!await canAccessLocation(workingDirectory)) {
        throw new Error(`pipespawn: working directory cannot be accessed: ${workingDirectory}`);
    }
    // write input to inFile if provided
    if (options.inFile.length > 0) {
        const writeStream = createWriteStream(`${workingDirectory}/${options.inFile}`);
        try {
            await pipeline(input, writeStream);
        }
        catch (err) {
            throw new Error(`pipespawn: failed to write input to file: ${workingDirectory}/${options.inFile}`);
        }
    }
    const proc = spawn(cmd, args, { cwd: workingDirectory });
    if (options.inFile.length === 0) {
        // if no inFile was specified, write input to the process' stdin
        input.pipe(proc.stdin);
    }
    try {
        const stdout = await new Promise((resolve, reject) => {
            const stderr = [];
            const stdout = [];
            proc.stdout.on('data', (data) => {
                stdout.push(data);
            });
            proc.stderr.on('data', (data) => {
                stderr.push(data);
            });
            proc.on('error', (err) => {
                reject(err);
            });
            proc.on('close', (code) => {
                if (code === 0) {
                    const res = Buffer.concat(stdout);
                    resolve(res);
                }
                else {
                    const res = Buffer.concat(stderr).toString('utf-8');
                    reject(new Error(res));
                }
            });
        });
        if (options.outFile.length === 0) {
            return stdout;
        }
        else {
            const outBuffer = await readFile(`${workingDirectory}/${options.outFile}`);
            return outBuffer;
        }
    }
    catch (err) {
        throw new Error(`pipespawn: failed to execute command: ${command}`);
    }
    finally {
        if (options.inFile.length > 0) {
            await unlink(`${workingDirectory}/${options.inFile}`);
        }
        if (options.outFile.length > 0) {
            await unlink(`${workingDirectory}/${options.outFile}`);
        }
    }
}
// pipespawnToBuffer takes a Readable, passes it through an external command,
// and returns the stdout as a Buffer.
// The behaviour can change slightly depending on the flags that are set within
// the provided (and optional) SpawnOptions object.
export async function pipespawnToBuffer(input, command, options) {
    const output = await pipespawnImpl(input, command, options);
    return output;
}
// pipespawnToString takes a Readable, passes it through an external command,
// and returns the stdout as a string.
// The behaviour can change slightly depending on the flags that are set within
// the provided (and optional) SpawnOptions object.
export async function pipespawnToStream(input, command, options) {
    const output = await pipespawnImpl(input, command, options);
    return Readable.from(output);
}
export const pipespawn = {
    toBuffer: pipespawnToBuffer,
    toStream: pipespawnToStream
};
//# sourceMappingURL=pipespawn.js.map