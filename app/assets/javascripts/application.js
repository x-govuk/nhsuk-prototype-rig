// Sass entry point for rollup.js
import '../stylesheets/application.scss'

import { initAll as GOVUKPrototypeComponents } from '@x-govuk/govuk-prototype-components'
import { initAll as GOVUKFrontend } from 'govuk-frontend'

// Initiate scripts on page load
document.addEventListener('DOMContentLoaded', () => {
  GOVUKFrontend()
  GOVUKPrototypeComponents()
})
