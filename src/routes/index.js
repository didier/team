const {
	Read
} = require('../db')

const getIndex = async (req, res) => {
	const query = req.body || {}
	// console.log('Logged in user:', req.session)
	const loggedInUser = req.session.user

	res.cookie('user', loggedInUser)

	const users = await Read({
		collection: 'users',
		query: query
	})

	res.status(200).render('index', {
		users,
		user: loggedInUser,
		title: 'Dating App',
	})
}


const postIndex = async (req, res) => {
	if (!req.body) {
		res.redirect('/')
		return
	}

	const user = req.cookies.user
	console.log('Cookie: ', user)
	// console.log(req.session)

	// Search Functionality
	const searchQuery = req.body
	searchQuery.age = parseInt(searchQuery.age)
	console.log('response: ', searchQuery)

	// Add functionality to like & dislike users

	if (searchQuery.like === 'false') {
		console.log('add userID to disliked')
		/* update Update({ collection = '', query = {}, data = {}, single = true }) */
		/* update disliked = ID of (disliked person) WHERE _ID === req.session.user.id */



		Update('users', query, data, true)

	} else {
		console.log('add userID to liked')
	}

	const query = {
		$and: [
			user.liked && {
				_id: {
					$nin: [...req.session.user.liked]
				}
			},
			{
				age: {
					$lte: searchQuery.age,
				},
			},
			searchQuery.orientation === 'x' ? {} : {
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
		user
	})
}
module.exports = {
	getIndex,
	postIndex
}
