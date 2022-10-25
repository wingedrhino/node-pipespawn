# Developer Documentation

This package is written in TypeScript; the source code is in the `src`
directory. The `dist` directory contains the compiled JavaScript code. They are
both checked into version control.

## Developer Environment

We always support the latest mainline Node.js version. LTS support shall NOT be
assumed. Any feature that is available in a just-released stable mainline
Node.js release can be used right away.

VS Code is the preferred IDE, and you don't need any extra extensions to
develop this package.

The [Standard JS](https://github.com/standard/vscode-standard) extension is the
recommended linter; and you might want to uninstall/disable ESLint, Prettier,
etc.

Currently, there's an on-going issue with the Standard JS extension that's
linked [here](https://github.com/standard/vscode-standard/issues/483). Until
that's resolved, it is recommended to NOT enable any auto-formatting features
within VS Code. Running `npm run lint:fix` should be enough.

I (Rhino) use GitLens, GitHub CoPilot, and GitHub CoPolot Labs while developing
this project, but you don't need them.

## Testing

Tests are in the `test` folder. `test/harness.ts` contains common test code.
Individual test suites are named `testname.test.ts`.

Each test file has an async method for each unique test. These methods are then
grouped together and run under a test suite, via `uvu`.

Assertions are made via (`earljs`)[https://earljs.dev/].

## Running TypeScript Directly

You can run TypeScript directly, without compiling to JavaScript, by using
`node --loader tsm filename.ts`.

[This page](https://github.com/lukeed/tsm/issues/5) explains why we use `tsm`
instead of `ts-node`. This is still a somewhat experimental feature of Node; so
if breakages occur, we'd need ot provide prompt updates. Also read
[this](https://nodejs.org/api/esm.html#loaders).

## Debugging

You can debug the code in VS Code, via the included `launch.json`. This uses
`tsm` as a custom loader, so you can debug TypeScript directly.

## Publishing a new package

1. Update the version in `package.json`
2. Run `npm run build`
3. Run `npm publish`

## Running tests

1. Run `npm run build`
2. Run `npm test`
