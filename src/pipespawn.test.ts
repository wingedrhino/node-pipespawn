import * as assert from 'node:assert'
import { Readable } from 'node:stream'
import { canAccessLocation, pipespawn } from './pipespawn.js'
import { tmpdir } from 'node:os'

async function stdioTest (): Promise<void> {
  const input = 'The quick brown fox jumps over the lazy dog'
  const expectedOutput = 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG'
  const inputReadable = Readable.from(input)
  const outputBuf = await pipespawn.toBuffer(inputReadable, 'tr [:lower:] [:upper:]')
  const output = outputBuf.toString('utf-8')
  assert.strictEqual(output, expectedOutput)
}

async function createInputFileTest (): Promise<void> {
  const input = 'The quick brown fox jumps over the lazy dog'
  const expectedOutput = input
  const inputFile = 'in.txt'
  const outputFile = 'out.txt'
  const inputReadable = Readable.from(input)
  const outputBuf = await pipespawn.toBuffer(inputReadable, 'cp in.txt out.txt', {
    inFile: inputFile,
    outFile: outputFile
  })
  const output = outputBuf.toString('utf-8')
  assert.strictEqual(output, expectedOutput)
  const isInputFileExists = await canAccessLocation(`${tmpdir()}/${inputFile}`)
  assert.strictEqual(isInputFileExists, false)
  const isOutputFileExists = await canAccessLocation(`${tmpdir()}/${outputFile}`)
  assert.strictEqual(isOutputFileExists, false)
}

async function exampleTest (): Promise<void> {
  // pass the word "hi" to the tr command, and convert lower case to upper case
  // via stdin-stdout piping.
  const outputBuf = await pipespawn.toBuffer(Readable.from('hi'), 'tr [:lower:] [:upper:]')
  const output = outputBuf.toString('utf-8')
  assert.strictEqual(output, 'HI')
  // create a input.txt, write the word "hi" to it, copy it to output.txt, read
  // the contents of output.txt back, and delete both files. Do this in the OS's
  // default tmp directory
  const outputBuf2 = await pipespawn.toBuffer(Readable.from('hi'), 'cp input.txt output.txt', {
    inFile: 'input.txt',
    outFile: 'output.txt',
    useTmpDir: true
  })
  const output2 = outputBuf2.toString('utf-8')
  assert.strictEqual(output2, 'hi')
}

// Run Tests
await stdioTest()
await createInputFileTest()
await exampleTest()
console.log('All tests passed!')
