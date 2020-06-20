const { Create } = require('../db')

const postAdd = async (req, res) => {
	const data = req.body

	if (data) {

		if (process.env.NODE_ENV === 'debug') {
			console.log(data)
		}
	}

	await Create({
		collection: 'users',
		data,
	})

	res.status(200).render('add')
}

module.exports = { postAdd }
