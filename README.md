# pipespawn

`pipespawn` is a package that lets you pipe data from an input Readable /
Buffer into an external process and read back the processed data from the
external process as a Readable / Buffer.

It can operate in two ways: by default, it pipes the data from the input to
the external process' stdin, and then reads the external process' stdout.

But if you provide an optional `SpawnOptions` object to the calls, you can
write the data to a temporary `inFile` before executing the external process,
read from a temporary `outFile` after executing the external process, and clean
up afterwards by deleting both `inFile` and `outFile`.

The `inFile` option is used INSTEAD of `stdin`, and the `outFile` option is
used INSTEAD of `stdout`. But it should be possible to write to `stdin` and
read from `outFile`, or write to `inFile` and read from `stdout`. I don't
know any programs that are written this way, so I haven't tested it.

You can choose to leave the current working directory as-is, or set it to a
custom location, or to the OS's default temporary directory.

Creating a task-specific `/tmp/pipespawn-<task-name>` directory is a good idea,
because a lot of files can be created and deleted when you call pipespawn
multiple times concurrently. You should ensure this directory exists before
pipespawning.

If an error occured during the process, it is thrown as an exception.

If the process returns with a non-zero exit code, the exit code and the stderr
are returned in a new Error object.

It can be useful for things like using an external CLI that reads from stdin
and writes to stdout to transcode an image stream to a different format.

You can also invoke a tool like FFMPEG, by writing the input buffer into a
temporary file, letting FFMPEG read from that file, and then deleting the
temporary file after it's been read.

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

```

## Caveats

### Large Files

Currently, pipespwn reads the contents of the output file into memory before
returning it. This is a limitation that can be fixed in the future. But until
that happens, try not to use pipespawn for large files.

### DeDuping inFile & outFile

If you run pipespawn in parallel for multiple tasks, make sure to use a unique
`inFile` and `outFile` for each task. One way to do this is by using the
[`uuid`](https://www.npmjs.com/package/uuid) package and using that as a prefix
to the `inFile` and `outFile` names. We don't do this automatically because
pipespawn is written to have no external dependencies.
