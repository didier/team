const { Read } = require('../db')

const getIndex = async (req, res) => {
	const query = req.body || {}

	const users = await Read({
		collection: 'users',
		query: query,
	})

	res.status(200).render('index', {
		users,
		title: 'Dating App',
	})
}

const postIndex = async (req, res) => {
	if (!req.body) {
		res.redirect('/')
		return
	}

	const response = req.body
	const age = parseInt(response.age)
	const orientation = response.orientation

	const query = {
		$and: [
			{
				age: {
					$lte: age,
				},
			},
			orientation === 'x'
				? {}
				: {
						gender: {
							$eq: orientation,
						},
				  },
		],
	}

	const users = await Read({
		collection: 'users',
		query,
	})

	res.status(200).render('index', {
		users,
	})
}
module.exports = { getIndex, postIndex }
