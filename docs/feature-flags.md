# Feature flags

You may have designed a feature which is not ready to be shown during a research session for another feature. Or perhaps you have 2 solutions to a problem and you want to test both with different participants.

The Prototype Rig lets you describe these feature, and includes a way to turn theme on or off. A feature may be part of a page, or a complete user journey.

## Adding a feature flag

You can create a new feature flag by adding an object to the `features` property in the default session data file (`./app/data.js`):

```js
features: {
  'feature-name' {
    on: true,
    name: 'Name of feature',
    description: 'Brief description of feature.'
  }
}
```

## Toggling a feature flag

To turn a feature on or off, click the ‘Feature flags’ link in the footer.
