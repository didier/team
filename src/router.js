const router = require('express').Router()

const { getIndex, postIndex } = require('./routes/index')
const { getLogin, postLogin } = require('./routes/login')
const { getMatch, postMatch } = require('./routes/match')
const { getMatches } = require('./routes/matches')
const { getSignup, postSignup } = require('./routes/signup')
const { getProfile, postProfile } = require('./routes/profile')
const { postAdd } = require('./routes/add')
const { logout } = require('./routes/logout')
const { postChat, getChat, getChatFrame } = require('./routes/chat')


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
	.get('/profile', validateSession, getProfile)
	.post('/profile', postProfile)
	.get('/login', getLogin)
	.post('/login', postLogin)
	.get('/signup', getSignup)
	.get('/match/*', validateSession, getMatch)
	.get('/matches/', validateSession, getMatches)
	.post('/match/:userId/', validateSession, postMatch)
	.post('/signup', postSignup)
	.post('/add', postAdd)
	.get('/logout', logout)
	.post('/logout', logout)
	.get('/chat', getChat)
	.get('/chat/:userId', validateSession, getChat)
	.get('/chat/frame/:userId', validateSession, getChatFrame)
	.post('/chat/:userId', validateSession, postChat)

module.exports = router
