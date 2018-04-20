const AuthenticationController = require('./controllers/AuthenticationController')
const MoviesController = require('./controllers/MoviesController')
const UsersController = require('./controllers/UsersController')
const CommentsController = require('./controllers/CommentsController')
const SubtitlesController = require('./controllers/SubtitlesController')
const ViewsController = require('./controllers/ViewsController')
const StreamController = require('./controllers/StreamController')
const UploadController = require('./controllers/UploadController')

module.exports = (app, passport) => {
  app.post('/auth/register',
    UploadController.single('image'),
    AuthenticationController.validateRegister,
    AuthenticationController.register)
  app.post('/auth/login',
    AuthenticationController.login)
  app.get('/auth/user',
    AuthenticationController.authenticated,
    UsersController.self)
  app.post('/auth/forgot',
    AuthenticationController.validateForgotPassword,
    AuthenticationController.forgotPassword)
  app.post('/auth/reset',
    AuthenticationController.validateResetPassword,
    AuthenticationController.resetPassword)

  app.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['public_profile', 'email'] }))
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {session: false}),
    AuthenticationController.login)
  app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }))
  app.get('/auth/google/callback',
    passport.authenticate('google', {session: false}),
    AuthenticationController.login)
  app.get('/auth/42',
    passport.authenticate('42'))
  app.get('/auth/42/callback',
    passport.authenticate('42', { session: false }),
    AuthenticationController.login)

  app.put('/account',
    AuthenticationController.authenticated,
    UploadController.single('image'),
    UsersController.validateUpdate,
    UsersController.update)
  app.get('/movies',
    // AuthenticationController.authenticated,
    MoviesController.index)
  app.get('/movies/:movieId',
    // AuthenticationController.authenticated,
    MoviesController.show)
  app.get('/movies/:movieId/comments',
    AuthenticationController.authenticated,
    CommentsController.show)
  app.get('/users/:login',
    AuthenticationController.authenticated,
    UsersController.show)
  app.post('/comments',
    AuthenticationController.authenticated,
    CommentsController.post)
  app.get('/movies/:movieId/subtitles',
    AuthenticationController.authenticated,
    SubtitlesController.show)
  app.get('/movies/:movieId/views',
    AuthenticationController.authenticated,
    ViewsController.show)
  app.get('/streams/:movieId',
    AuthenticationController.authenticated,
    StreamController.show)
}
