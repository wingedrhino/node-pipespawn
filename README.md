# pipespawn

`pipespawn` is a package that lets you pipe data from a Readable stream into an
external process and then read the process's stdout as either a Readable stream
or as a Buffer.

If an error occured during the piping, it is thrown as an exception.

If the process returns with a non-zero exit code, the exit code and the stderr
are returned in a new Error object.

It can be useful for things like using an external CLI that reads from stdin
and writes to stdout to transcode an image stream to a different format.

I wrote this package because I needed a way to pipe data from a Readable stream
into inkscape to convert an SVG into a high quality PNG.

## Usage

`pipespawn` exports a `pipespawn` object with two methods, `toBuffer` and
`toStream`. It also exports a `pipespawnToBuffer` and a `pipespawnToStream`
function that can be used instead of the `pipespawn` object.

All functions take two arguments:

A Readable (you can do `Readable.from(bufferOrString)` to generate one from a
blob) and a command string (the command to run with all its arguments).

```typescript
import * as assert from 'node:assert'
import { Readable } from 'node:stream'
import { pipespawn } from './pipespawn.js'

const input = 'The quick brown fox jumps over the lazy dog'
const expectedOutput = 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG'
const inputReadable = Readable.from(input)
const outputBuf = await pipespawn.toBuffer(inputReadable, 'tr [:lower:] [:upper:]')
const output = outputBuf.toString('utf-8')
assert.strictEqual(output, expectedOutput)
```
