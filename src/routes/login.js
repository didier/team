const { Read } = require('../db')
const bcrypt = require('bcrypt')

const getLogin = (req, res) => {
	res.status(200).render('login', {
		title: 'Login',
		signUp: false,
	})
}

const postLogin = async (req, res) => {
	const data = req.body
	const results = await Read({
		collection: 'users',
		query: {
			email: {
				$eq: data.email,
			},
		},
	})

	req.session.user = { ...results[0] }
	console.log('Session-data:')
	console.log(req.session.user)

	if (results.length === 0) {
		res.render('login', {
			signUp: false,
			errorMessage: 'No user was found with that that e-mail. Would you like to <a href="/signup">sign up?</a>',
		})
		return
	}

	bcrypt.compare(data.pass, results[0].pass, (err, result) => {
		console.log('Results:', result)

		if (err) {
			throw err
		}

		if (result) {
			res.status(301).redirect('/')
		} else {
			res.status(401).redirect('/login')
		}
	})
}

module.exports = { getLogin, postLogin }
