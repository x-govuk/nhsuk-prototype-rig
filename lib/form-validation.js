/* global validate, NodeList */
const forms = document.querySelectorAll('[data-validate]')

/**
 * Check a date is valid
 *
 * @access private
 * @param {object} date - Date object
 * @returns {boolean} `true` if date is valid
 */
const _isValidDate = (date) => {
  return date instanceof Date && !isNaN(date)
}

/**
 * Custom conditional validator
 *
 * @see {@link https://validatejs.org/#custom-validator}
 * @param {string} value - Value entered
 * @param {object} options - Options passed in the `validate` param
 * @param {string} key - Attribute to validate.
 * @param {object} attributes - All the attributes
 * @returns {string|undefined} Validation message
 */
validate.validators.conditional = function (value, options, key, attributes) {
  const { name } = options.dependentOn
  const dependent = document.querySelector(`[name="${name}"]:checked`)

  if (dependent) {
    if (dependent.value === options.dependentOn.value) {
      return options.message || this.message || 'Required'
    }
  }
}

/**
 * Custom date validator. We only validate the year value
 *
 * @see {@link https://validatejs.org/#custom-validator}
 * @param {string} value - Value entered
 * @param {object} options - Options passed in the `validate` param
 * @param {string} key - Attribute to validate.
 * @param {object} attributes - All the attributes
 * @returns {string} Validation message
 */
validate.validators.date = function (value, options, key, attributes) {
  const year = attributes[key] || ''
  const month = attributes[key.replace('year', 'month')] || ''
  const day = attributes[key.replace('year', 'day')] || ''

  const isoDate = [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-')

  const date = new Date(isoDate)

  if (!_isValidDate(date)) {
    return options.message ? options.message : 'Enter a valid date'
  }
}

function getSubmitHandler(form) {
  return function submitHandler(event) {
    // Don’t submit the form
    event.preventDefault()

    // Remove hidden inputs used to remember unchecked $inputs
    removeHiddenFormElements()

    const validations = document.getElementById('form-validation').innerHTML
    const errors = validate(form, JSON.parse(validations), {
      fullMessages: false
    })

    // If no errors, submit the form
    if (!errors) {
      form.removeEventListener('submit', submitHandler)
      form.submit()
      return
    }

    // Remove previous error messages and summary
    removeErrorSummary()
    for (const element of form.elements) {
      removeErrorMessage(element)
    }

    // Show new error messages and summary
    showErrorSummary(errors)
    for (const name in errors) {
      if (Object.prototype.hasOwnProperty.call(errors, name)) {
        showErrorMessage(form, name, errors[name][0])
      }
    }
  }
}

const nameToId = (name) => {
  return name.replace('][', '-').replace('[', '').replace(']', '')
}

function removeHiddenFormElements() {
  const hiddenElements = document.querySelectorAll('input[value="_unchecked"]')
  hiddenElements.forEach((element) => element.parentNode.removeChild(element))
}

function removeErrorMessage(element) {
  element.classList.remove('nhsuk-input--error')
  element.classList.remove('nhsuk-select--error')
  element.classList.remove('nhsuk-textarea--error')

  let formGroup = element.closest('.nhsuk-form-group')

  if (element.classList.contains('nhsuk-date-input__input')) {
    // Date inputs are doubly grouped - we want the parent one
    formGroup = formGroup.parentNode.closest('.nhsuk-form-group')

    // Mark all date inputs in this group as errored, not just the one
    const dateInputs = formGroup.querySelectorAll('.nhsuk-date-input__input')
    dateInputs.forEach((dateInput) => {
      dateInput.classList.remove('nhsuk-input--error')
    })
  }

  formGroup && formGroup.classList.remove('nhsuk-form-group--error')
  const errorMessage = element.parentNode.querySelector('.nhsuk-error-message')
  errorMessage && errorMessage.parentNode.removeChild(errorMessage)
}

function showErrorMessage(form, name, error) {
  const element = Object.prototype.isPrototypeOf.call(
    NodeList.prototype,
    form[name]
  )
    ? form[name][0]
    : form[name]

  element.setAttribute('aria-describedby', `${nameToId(name)}-error`)

  switch (true) {
    case element.classList.contains('nhsuk-input'):
      element.classList.add('nhsuk-input--error')
      break
    case element.classList.contains('nhsuk-select'):
      element.classList.add('nhsuk-select--error')
      break
    case element.classList.contains('nhsuk-textarea'):
      element.classList.add('nhsuk-textarea--error')
      break
    default:
  }

  // Get form group
  let formGroup = element.closest('.nhsuk-form-group')

  // Date inputs are doubly grouped - we want the parent one
  if (element.classList.contains('nhsuk-date-input__input')) {
    formGroup = formGroup.parentNode.closest('.nhsuk-form-group')

    // Mark all date inputs in group as errored, not just the year
    const dateInputs = formGroup.querySelectorAll('.nhsuk-date-input__input')
    dateInputs.forEach((dateInput) =>
      dateInput.classList.add('nhsuk-input--error')
    )
  }

  // Add error class to form group
  formGroup.classList.add('nhsuk-form-group--error')

  // Create a new error message
  const template = document.querySelector('#nhsuk-error-message-template')

  const nhsukErrorMessage = template.content.cloneNode(true)
  nhsukErrorMessage.firstElementChild.id = `${nameToId(name)}-error`

  const visuallyHiddenPrefix = nhsukErrorMessage.querySelector('span')
  visuallyHiddenPrefix.insertAdjacentHTML('beforeend', error)

  // Insert error message above the field input
  if (element.classList.contains('nhsuk-radios__input')) {
    element.closest('.nhsuk-radios').before(nhsukErrorMessage)
  } else if (element.classList.contains('nhsuk-date-input__input')) {
    element.closest('.nhsuk-date-input').before(nhsukErrorMessage)
  } else if (element.classList.contains('nhsuk-checkboxes__input')) {
    element.closest('.nhsuk-checkboxes').before(nhsukErrorMessage)
  } else {
    formGroup.insertBefore(nhsukErrorMessage, form[name])
  }
}

function jumpToError(event, name) {
  event.preventDefault()
  removeHiddenFormElements()

  const targetElement = document.getElementById(nameToId(name))
  let formGroup = targetElement.closest('.nhsuk-form-group')

  // Date inputs are doubly grouped - we want the parent
  if (targetElement.classList.contains('nhsuk-date-input__input')) {
    formGroup = formGroup.parentNode.closest('.nhsuk-form-group')
  }

  // Place focus on the form control
  targetElement.focus()

  // Scroll to the form group (not the field)
  window.scrollTo(0, formGroup.offsetTop)
}

function removeErrorSummary() {
  const previousSummary = document.querySelector('.nhsuk-error-summary')
  previousSummary && previousSummary.parentNode.removeChild(previousSummary)
}

function showErrorSummary(errors) {
  if (!errors) {
    return
  }

  // Create a new error summary
  const template = document.querySelector('#nhsuk-error-summary-template')
  const nhsukErrorSummary = template.content.cloneNode(true)

  // Add links to validation messages to error summary list
  const errorList = nhsukErrorSummary.querySelector('ul')
  for (const name in errors) {
    if (Object.prototype.hasOwnProperty.call(errors, name)) {
      const errorLink = document.createElement('a')
      errorLink.textContent = errors[name][0]
      errorLink.setAttribute('href', `#${nameToId(name)}`)
      errorLink.addEventListener('click', (event) => jumpToError(event, name))

      const errorItem = document.createElement('li')
      errorItem.appendChild(errorLink)
      errorList.appendChild(errorItem)
    }
  }

  // Insert error summary at the top of the page
  document.querySelector('main').prepend(nhsukErrorSummary)

  // Place focus on the error summary
  const newErrorSummary = document.querySelector('.nhsuk-error-summary')
  newErrorSummary.focus()
}

forms.forEach((form) => {
  form.addEventListener('submit', getSubmitHandler(form))
})
