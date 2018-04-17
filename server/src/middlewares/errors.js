module.exports = (app) => {
  app.use(function errorsCatcher (err, req, res, next) {
    if (!err.statusCode || !err.message) {
      // console.error(err)
      err.statusCode = 499
      err.message = 'Internal server error'
    }
    return res
      .status(err.statusCode)
      .json({ error: err.statusCode, message: err.message })
  })
}
