# NHS.UK Prototype Rig

A WIP NHS.UK of the [GOV.UK Prototype Rig](https://x-govuk.github.io/govuk-prototype-rig/).

## Requirements

- Node.js v20

## Installation

1. Clone this repository:\
   `git clone git@github.com:x-govuk/nhsuk-prototype-rig.git`

2. Install the dependencies:\
   `npm install`

3. Start the application:\
   `npm start`

You can change the service name by changing the `prototype.serviceName` value in `package.json`.

By default, the rig expects templates to use the `.html` file extension. You can change this by setting the `prototype.templateExtension` value in `package.json`.

## Developing locally

To automatically refresh the browser upon updating a file, use `npm run dev`.

To lint JavaScript and CSS files, use `npm run lint`.

## Releasing a new version

`npm run release`

This command will ask you what version you want to use. It will then publish a new version on NPM, create and push a new git tag and then generate release notes ready for posting on GitHub.

> [!NOTE]
> Releasing a new version requires permission to publish packages to the `@x-govuk` organisation.

## Contributing

If you’ve got an idea or suggestion, please [create a GitHub issue](https://github.com/x-govuk/nhsuk-prototype-rig/issues).
