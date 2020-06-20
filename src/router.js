const router = require('express').Router()

const { getIndex, postIndex } = require('./routes/index')
const { getLogin, postLogin } = require('./routes/login')
const { getMatch, postMatch } = require('./routes/match')
const { getMatches } = require('./routes/matches')
const { getSignup, postSignup } = require('./routes/signup')
const { getProfilePage, postProfilePage } = require('./routes/profile')
const { postAdd } = require('./routes/add')
const { postLogout } = require('./routes/logout')
const { getChat } = require('./routes/chat')


function validateSession(req, res, next) {
	if (req.session.user) {
		next()
	} else {
		res.redirect('/login')
	}
}

router
	.get('/', validateSession, getIndex)
	.post('/', postIndex)
	.get('/profile-page', validateSession, getProfilePage)
	.post('/profile-page', postProfilePage)
	.get('/login', getLogin)
	.post('/login', postLogin)
	.get('/signup', getSignup)
	.get('/match/*', validateSession, getMatch)
	.get('/matches/', validateSession, getMatches)
	.post('/match/:userId/', validateSession, postMatch)
	.post('/signup', postSignup)
	.post('/add', postAdd)
	.post('/logout', postLogout)
	.get('/chat', getChat)
	.get('/chat/:userId', validateSession, getChat)

module.exports = router
