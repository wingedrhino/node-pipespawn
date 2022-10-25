import { expect } from 'earljs';
import { suite } from 'uvu';
import { Readable } from 'node:stream';
import { canAccessLocation, pipespawn } from '../src/pipespawn.js';
import { tmpdir } from 'node:os';
import { beforeAll, afterAll } from './harness.js';
async function stdioTest() {
    const input = 'The quick brown fox jumps over the lazy dog';
    const expectedOutput = 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG';
    const inputReadable = Readable.from(input);
    const outputBuf = await pipespawn.toBuffer(inputReadable, 'tr [:lower:] [:upper:]');
    const output = outputBuf.toString('utf-8');
    expect(output).toEqual(expectedOutput);
}
async function createInputFileTest() {
    const input = 'The quick brown fox jumps over the lazy dog';
    const expectedOutput = input;
    const inputFile = 'in.txt';
    const outputFile = 'out.txt';
    const inputReadable = Readable.from(input);
    const outputBuf = await pipespawn.toBuffer(inputReadable, 'cp in.txt out.txt', {
        inFile: inputFile,
        outFile: outputFile
    });
    const output = outputBuf.toString('utf-8');
    expect(output).toEqual(expectedOutput);
    const isInputFileExists = await canAccessLocation(`${tmpdir()}/${inputFile}`);
    expect(isInputFileExists).toEqual(false);
    const isOutputFileExists = await canAccessLocation(`${tmpdir()}/${outputFile}`);
    expect(isOutputFileExists).toEqual(false);
}
async function exampleTest() {
    // pass the word "hi" to the tr command, and convert lower case to upper case
    // via stdin-stdout piping.
    const outputBuf = await pipespawn.toBuffer(Readable.from('hi'), 'tr [:lower:] [:upper:]');
    const output = outputBuf.toString('utf-8');
    expect(output).toEqual('HI');
    // create a input.txt, write the word "hi" to it, copy it to output.txt, read
    // the contents of output.txt back, and delete both files. Do this in the OS's
    // default tmp directory
    const input2Buf = Buffer.from('hi');
    const outputBuf2 = await pipespawn.toBuffer(input2Buf, 'cp input.txt output.txt', {
        inFile: 'input.txt',
        outFile: 'output.txt',
        useTmpDir: true
    });
    const output2 = outputBuf2.toString('utf-8');
    expect(output2).toEqual('hi');
}
// Run tests via uvu
const tests = suite('pipespawn');
tests.before(beforeAll);
tests.after(afterAll);
tests('test pipespawn with stdio', stdioTest);
tests('test pipespawn by creating an input file and reading an output file', createInputFileTest);
tests('test pipespawn example from README.md', exampleTest);
tests.run();
//# sourceMappingURL=pipespawn.test.js.map