const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
const MoviesController = require('./controllers/MoviesController')

module.exports = (app, passport) => {
  app.post('/register',
    AuthenticationControllerPolicy.register,
    AuthenticationController.register)
  app.post('/login',
    AuthenticationController.login)
  app.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['public_profile', 'email'] }))
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function (req, res) {
      res.redirect('/')
    })
  app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }))
  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
      res.redirect('/')
    })
  app.get('/auth/42',
    passport.authenticate('42'))
  app.get('/auth/42/callback',
    passport.authenticate('42', { failureRedirect: '/login' }),
    function (req, res) {
      res.redirect('/')
    })
  app.get('/movies',
    MoviesController.index)
  app.post('/movies',
    MoviesController.index)
}
