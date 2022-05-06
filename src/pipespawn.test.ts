import * as assert from 'node:assert'
import { Readable } from 'node:stream'
import { pipespawn } from './pipespawn.js'

const input = 'The quick brown fox jumps over the lazy dog'
const expectedOutput = 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG'
const inputReadable = Readable.from(input)
const outputBuf = await pipespawn.toBuffer(inputReadable, 'tr [:lower:] [:upper:]')
const output = outputBuf.toString('utf-8')
assert.strictEqual(output, expectedOutput)
