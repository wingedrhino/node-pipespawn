import { spawn } from 'node:child_process'
import { Readable } from 'node:stream'

/**
 * pipespawnImpl takes a Readable stream, and pipes it through an external
 * process, and returns the stdout body as a Buffer.
 * If there was an error, it collects the stderr into a message Buffer,
 * and returns the non-zero exit code as the error name.
 */
async function pipespawnImpl (input: Readable, command: string): Promise<Buffer> {
  const [cmd, ...args] = command.split(' ')
  if (typeof cmd !== 'string') {
    throw new Error('pipespawn: command must be a string')
  }
  const proc = spawn(cmd, args)
  input.pipe(proc.stdin)
  return await new Promise((resolve, reject) => {
    const stderr: Buffer[] = []
    const stdout: Buffer[] = []
    proc.stdout.on('data', (data) => {
      stdout.push(data)
    })
    proc.stderr.on('data', (data) => {
      stderr.push(data)
    })
    proc.on('error', (err) => {
      reject(err)
    })
    proc.on('close', (code) => {
      if (code === 0) {
        const res = Buffer.concat(stdout)
        resolve(res)
      } else {
        const res = Buffer.concat(stderr).toString('utf-8')
        reject(new Error(res))
      }
    })
  })
}

// pipespawnToBuffer takes a Readable, passes it through an external command,
// and returns the stdout as a Buffer.
export async function pipespawnToBuffer (input: Readable, command: string): Promise<Buffer> {
  const output = await pipespawnImpl(input, command)
  return output
}

// pipespawnToString takes a Readable, passes it through an external command,
// and returns the stdout as a string.
export async function pipespawnToStream (input: Readable, command: string): Promise<Readable> {
  const output = await pipespawnImpl(input, command)
  return Readable.from(output)
}

export const pipespawn = {
  toBuffer: pipespawnToBuffer,
  toStream: pipespawnToStream
}
