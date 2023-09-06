# Wizard helper

The wizard helper makes it easy to build and iterate a ‘one thing per page’ user journey.

## Importing the wizard helper

```js
import { wizard } from 'govuk-prototype-rig'
```

## Usage

The `wizard` helper takes two parameters:

| Name | Type | Description |
| :--- | :--- | :---------- |
| **journey** | object | **Required.** A journey object, which defines the default user journey and any branching rules |
| **req** | object | **Required.** The express request object |

It returns a `paths` object with paths for the next, back and the current pages.

For the following journey:

```js
const journey = {
  '/': {},
  '/name': {},
  '/where-do-you-live': {},
  '/nationality': {},
  '/check-answers': {},
  '/confirm': {}
}

wizard(journey, req)
```

If the request was made from `/nationality`, the helper returns:

```js
{
  back: '/where-do-you-live',
  current: '/nationality',
  next: '/check-answers'
}
```

### Forking a journey

By default a user will progress through the journey in the order set out.

You can fork from that journey by giving a list of paths and conditions – if the conditions are met the user will follow the fork.

```js
{
  '/path': {
    // Redirect if session.data.key equals 'Some value'
    '/path-to-fork-to': { data: 'key', value: 'Some value' },

    // Redirect if session.data.key is in the given array
    '/path-to-fork-to': { data: 'key', values: ['A value', 'Another value'] },

    // Redirect if session.data.key does not equal 'Some value'
    '/path-to-fork-to': { data: 'key', excludedValue: 'Some value' },

    // Redirect if session.data.key is not in the given array
    '/path-to-fork-to': { data: 'key', excludedValues: ['A value', 'Another value'] },

    // Redirect if the given function evaluates to true
    '/path-to-fork-to': () => {
      return req.session.data.key == 'Something else'
    },

    // Shorthand
    '/path-to-fork-to': () => req.session.data.key == 'Something else',

    // Always redirect
    '/path-to-fork-to': true
  }
}
```

Each path can have multiple forks, they are evaluated in order – the user will be redirected to the first page that meets the conditions.

```js
{
  // Go to different pages based on the country chosen
  '/pick-a-country': {
    '/scotland': { data: 'country', value: 'Scotland' },
    '/wales': { data: 'country', value: 'Wales' },
    '/ireland': { data: 'country', values: ['Ireland', 'Northern Ireland'] },
    '/asia': () => isCountryInAsia(req.session.data.country),
    '/other-countries': true
  }
}
```

## An example

In this example we:

* ask the user their name
* ask if they have a National Insurance number, then:
  * skip the ‘What is your National Insurance number?’ question if they do not have a number
  * continue to the ‘What is your National Insurance number?’ question if they do
* ask for their email address

```js
{
  '/name': {},
  '/do-you-have-a-national-insurance-number': {
    '/email': { data: 'have-nino', value: 'No' }
  },
  '/what-is-your-national-insurance-number': {},
  '/email': {}
}
```

## How to get a wizard working

### Create a user journey

```js
import { wizard } from 'govuk-prototype-rig'

export function exampleWizard (req) {
  const journey = {
    '/examples/wizard': {},
    '/examples/wizard/name': {},
    '/examples/wizard/where-do-you-live': {
      // Example fork in the journey:
      // Go to nationality page if answer to the question ‘Where do you live?’ is not England
      '/examples/wizard/nationality': {
        data: 'wizard.where-do-you-live',
        excludedValue: 'England'
      }
    },
    '/examples/wizard/england': {},
    '/examples/wizard/nationality': {},
    '/examples/wizard/check-answers': {},
    '/examples/wizard/confirm': {},
    '/': {}
  }

  return wizard(journey, req)
}
```

### Set up the routes

1. Make the paths available in the view using routes
2. Post each form back to itself, evaluate the paths and redirect to the calculated next page

```js
import { exampleWizard } from './wizards.js'
const router = express.Router()

router.all('/examples/wizard/:view?', (req, res, next) => {
  res.locals.paths = exampleWizard(req)
  next()
})

router.post('/examples/wizard/:view?', (req, res) => {
  res.redirect(res.locals.paths.next)
})
```

### Use a layout which uses the paths object

An example Nunjucks layout extending the default rig layout:

```njk
{% extends "layouts/default.html" %}
{% block pageNavigation %}
  {{ backLink({
    href: paths.back
  }) }}
{% endblock %}

{% block content %}
  <div class="nhsuk-grid-row">
    <div class="nhsuk-grid-column-two-thirds">
      {% block beforeForm %}{% endblock %}
      <form method="post" novalidate>
        {% block form %}{% endblock %}
        {{ button({
          html: buttonText if buttonText else 'Continue'
        }) }}
      </form>
    </div>
  </div>
{% endblock %}
```

### Build your question pages

```njk
{% extends "layouts/wizard.html" %}
{% set title = "What is your name?" %}
{% block pageNavigation %}
  {{ backLink({
    href: paths.back
  }) }}
{% endblock %}

{% block form %}
  {{ input({
    label: {
      classes: "govuk-label--l",
      isPageHeading: true,
      text: title
    },
    decorate: ["wizard", "name"]
  }) }}
{% endblock %}
```
