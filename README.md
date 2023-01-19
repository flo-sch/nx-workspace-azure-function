# Flosch

This project was generated using [Nx](https://nx.dev).

## Getting started

Install the dependencies:

```bash
yarn install
```

And create a `local.settings.json` file containing:

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsFeatureFlags": "EnableWorkerIndexing",
    "AzureWebJobsStorage": "UseDevelopmentStorage=true"
  }
}
```

If you prefer, you can replace the value of `AzureWebJobsStorage` by the connectionString of an Azure Storage Account instead: https://github.com/Azure/azure-functions-nodejs-library/wiki/Azure-Functions-Node.js-Framework-v4#setup

## Start

If you defined `"AzureWebJobsStorage": "UseDevelopmentStorage=true"` in your local.settings.json file, you will need to run the local storage emulator (azurite) in a terminal.
Azurite can be installed globally running `yarn global add azurite`.

```bash
azurite --location ./tmp --blobHost 127.0.0.1 --blobPort 10000
```

You can start the backend apps locally using the `start` script.
This will compile all backend projects (with hot reload) with nx and run azure-function-core-tools server allowing you to invoke functions locally.

```bash
yarn run start
```

The function app should then be available at http://localhost:7071/

## Test

You can run integration tests (using a stub for azure-functions) using the `test` script.

```bash
yarn run test
```

## Build functions

You can build the functions using the `build` script.

```bash
yarn run build
```

## Build function app for production

By default, when running `func azure functionapp publish`, the entire node_modules folder is published together with the source code. This includes all devDependencies (which we do not need in production), and increases the archive size a lot (~280mb at the time of writing this README).

```bash
> du -hsx ./node_modules/* | sort -rh | head -10
401M	./node_modules/azure-functions-core-tools
 87M	./node_modules/@jest
 64M	./node_modules/typescript
 48M	./node_modules/jest-snapshot
 40M	./node_modules/@nrwl
 27M	./node_modules/@types
 24M	./node_modules/date-fns
 17M	./node_modules/rxjs
 15M	./node_modules/jest-config
 13M	./node_modules/istanbul-lib-instrument
```

In order to optimise the production archive, we added the root `node_modules` to `.funcignore`.
Since we still need dependencies to be deployed, a local NX plugin is available here.
The following scripts will build each application for production, using the `generatePackageJson` option of NX build,
Then aggregate all dependencies in a single `package.json` manifest containing runtime dependencies only,
Then install a "production-ready" node_modules within the dist folder.

```bash
# 1. Build each function with generatePackageJson flag on
yarn nx run plugin-azure-functions:build-all-functions --production
# 2. Aggregate runtime dependencies in a single ./dist/package.json manifest
yarn nx run plugin-azure-functions:generate-production-manifests
# 3. Install runtime dependencies
yarn install --cwd ./dist --production --frozen-lockfile --force
```

This gives us a much lighter, production-ready archive to publish (~590kb at the time of writing this README):

```bash
> du -hsx ./dist/node_modules/* | sort -rh | head -10
468K	./dist/node_modules/@azure
424K	./dist/node_modules/iconv-lite
312K	./dist/node_modules/uuid
188K	./dist/node_modules/long
 84K	./dist/node_modules/tslib
 60K	./dist/node_modules/safer-buffer
```

Now the application is ready to be deployed:

```bash
func azure functionapp publish {FUNCTION_APP_NAME_IN_AZURE} --typescript
```
