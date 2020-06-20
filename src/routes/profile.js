
const { Update } = require('../db')

//Dit laat de data van de ingelogde user zien op de profile page
async function getProfilePage (req, res, next) {
	console.log(req.session)

	const user = req.session.user

res.status(200).render('profile-page', {user})

}


//Wanneer je een input veld aanpast en op save klikt wordt de data in de database aangepast
const postProfilePage = async (req, res) => {
	const data = req.body
	const user = req.session.user

	if (data) {
		console.log(data)
	}

	await Update({
		collection: 'users',
		data,
	})

	res.status(200).render('profile-page.ejs', {user})
}

module.exports = { getProfilePage, postProfilePage }
