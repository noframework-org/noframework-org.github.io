# noframework.org

This is the content of the [noframework.org](https://noframework.org) website and how it is statically generated.

## Setup

Avoid Node > 18 because of the ssg-api has itself native a dependency which cannot be linked with 
node_module_version > 108.

`npm install`

## Build
This generates the pages in the `/out` subdirectory.

`npm run build`

## Test

`npm run test` will run node:tests

## Deployment

[A Github action](.github/workflows/main.yml) that runs the build and deploys the `/out` directory as 
GitHub pages.
