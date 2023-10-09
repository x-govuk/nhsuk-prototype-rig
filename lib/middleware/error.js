// Catch 404 and forward to error handler
export const notFoundError = (req, res, next) => {
  res.status(404)
  res.render('404.njk')
}

// Display error
export const internalServerError = (error, req, res, next) => {
  const errorMessage = error.message || error
  const status = error.status || 500

  console.error(errorMessage)

  res.status(status)
  res.render('500.njk', {
    error: errorMessage,
    status
  })
}
