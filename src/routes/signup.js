const {
	Read,
	Create
} = require('../db')
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
	const {
		email,
		firstName,
		lastName,
		age,
		gender,
		orientation
	} = data

	const user = {
		email,
		firstName,
		lastName,
		age,
		gender,
		pass: '',
		filter: {
			orientation,
			maxAge: age + 5
		},
		liked: [],
		disliked: []
	}


	const doesUserExist = await Read({
		collection: 'users',
		query: {
			email: {
				$eq: user.email,
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
		user.pass = hash

		await Create({
			collection: 'users',
			data: user,
		})
	})

	res.status(200).redirect('/')
}

module.exports = {
	getSignup,
	postSignup
}
