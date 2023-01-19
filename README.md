# Flosch

This project was generated using [Nx](https://nx.dev).

## Getting started

Install the dependencies:

```bash
yarn install
```

## Start

You can start the backend apps locally using the `start` script.
This will compile all backend projects (with hot reload) with nx and run azure-function-core-tools server allowing you to invoke functions locally.

```bash
yarn run start
```

The function app should then be available at http://localhost:7071/

## Build

You can build the application for production using the `build` script.
This will build all functions under the `./dist` subfolder, minified and optimised for production.

```bash
yarn run build
```

## Test

You can run integration tests (using a stub for azure-functions) using the `test` script.

```bash
yarn run test
```
