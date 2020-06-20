const router = require('express').Router()

const { getIndex, postIndex } = require('./routes/index')
const { getLogin, postLogin } = require('./routes/login')
const { getSignup, postSignup } = require('./routes/signup')
const { getProfilePage, postProfilePage } = require('./routes/profile')
const { postAdd } = require('./routes/add')
const { postLogout } = require('./routes/logout')

function validateSession(req, res, next) {
	if (req.session.user) {
		next()
	} else {
		res.redirect('/login')
	}
}

router
	.get('/', validateSession, getIndex)
	.get ('/profile-page', validateSession, getProfilePage)
	.post('/profile-page', postProfilePage)
	.get('/login', getLogin)
	.post('/login', postLogin)
	.get('/signup', getSignup)
	.post('/signup', postSignup)
	.post('/', postIndex)
	.post('/add', postAdd)
	.post('/logout', postLogout)

module.exports = router
