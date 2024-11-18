# About this project

The rig provides all you need to build interactive prototypes that look like pages on the NHS website.

Prototypes can be used to show ideas to people you work with, and during user research.

## Differences from the Prototype Kit

The rig is based on [GOV.UK Prototype Rig](https://x-govuk.github.io/govuk-prototype-rig/), a re-imagined version of the [GOV.UK Prototype Kit](https://govuk-prototype-kit.herokuapp.com/docs) aimed at developers familiar with the Nunjucks template language.

The Prototype Rig works in exactly the same way as the NHS Prototype Kit. It stores data in the session, uses [NHS.UK Frontend](https://github.com/nhsuk/nhsuk-frontend) components, and supports hosting prototypes on services like [Heroku](https://www.heroku.com).

## Features

- Default 404 page
- Error page that shows the cause of the error
- [Feature flags](feature-flags.md)
- Session data output to the JavaScript console
- Ability to use `async` functions for session data
- Support for [form validation](form-validation.md)
- Form [component helper](form-components.md)
- Nunjucks [template filters](filters.md)
- Full documentation, with code documented using [JSDoc](https://jsdoc.app).

## Privacy

You must protect user privacy at all times, even when using prototypes. Prototypes made with the rig look like the NHS website, but do not have the same security provisions. Always make sure you are handling user data appropriately.

## The rig is not a production framework

Things made with the rig may look like the NHS website, but do not have production code and likely aren’t fully accessible. Don’t use the rig as a base for a production service.
