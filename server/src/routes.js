const AuthenticationController = require('./controllers/AuthenticationController')
const MoviesController = require('./controllers/MoviesController')
const UsersController = require('./controllers/UsersController')
const CommentsController = require('./controllers/CommentsController')
const SubtitlesController = require('./controllers/SubtitlesController')
const ViewsController = require('./controllers/ViewsController')
const StreamController = require('./controllers/StreamController')

module.exports = (app, passport) => {
  app.post('/auth/register',
    AuthenticationController.validateRegister,
    AuthenticationController.register)
  app.post('/auth/login',
    AuthenticationController.login)
  app.get('/auth/user',
    AuthenticationController.authenticated,
    UsersController.show)

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

  app.get('/movies',
    MoviesController.index)
  app.get('/movies/:movieId',
    MoviesController.show)
  // app.get('/users/:userId',
  //   UsersController.show)
  app.get('/movies/:movieId/comments',
    CommentsController.show)
  app.post('/comments',
    CommentsController.post)
  app.get('/movies/:movieId/subtitles',
    SubtitlesController.show)
  app.get('/movies/:movieId/views',
    ViewsController.show)
  app.get('/streams/:movieId',
    StreamController.show)
}
