const { Read, Update } = require('../db')
const { ObjectId } = require('mongodb')
const getIndex = async (req, res) => {
	const query = req.body || {}
	const loggedInUser = req.session.user
	const votedUsers = [...loggedInUser.liked, ...loggedInUser.disliked].map((id) => ObjectId(id))

	res.cookie('user', loggedInUser)

	const users = await Read({
		collection: 'users',
		query: {
			...query,
			_id: {
				$nin: votedUsers,
			},
		},
	})

	res.status(200).render('index', {
		users,
		user: loggedInUser,
		title: 'Home',
	})
}

const postIndex = async (req, res) => {
	if (!req.body) {
		res.redirect('/')
		return
	}

	const user = req.cookies.user
	// Search Functionality
	const searchQuery = req.body
	searchQuery.age = parseInt(searchQuery.age)
	const query = {
		$and: [
			user.liked && {
				_id: {
					$nin: [...req.session.user.liked],
				},
			},
			{
				age: {
					$lte: searchQuery.age,
				},
			},
			searchQuery.orientation === 'x'
				? {}
				: {
						gender: {
							$eq: searchQuery.orientation,
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
		user,
	})
}
module.exports = {
	getIndex,
	postIndex,
}
