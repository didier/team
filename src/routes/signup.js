const { Read, Create } = require('../db')
const bcrypt = require('bcrypt')

const getSignup = (req, res) => {
	res.status(200).render('login', {
		title: 'Sign Up',
		signUp: true,
	})
}

const postSignup = async (req, res) => {
	const data = req.body
	data.age = parseInt(data.age)

	const doesUserExist = await Read({
		collection: 'users',
		query: {
			email: {
				$eq: data.email,
			},
		},
	})

	if (doesUserExist.length > 0) {
		res.render('login', {
			signUp: true,
			errorMessage: 'User already exists with that e-mail. Would you like to <a href="/login">log in?</a>',
		})
		return
	}

	bcrypt.hash(data.pass, 10, async (err, hash) => {
		data.pass = hash

		await Create({
			collection: 'users',
			data,
		})
	})

	res.status(200).redirect('/')
}

module.exports = { getSignup, postSignup }
