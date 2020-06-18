const {	Read } = require('../db')

async function getMatch() {

	// krijg de sessie data van de ingelogde user

	const user =  req.session.user;

	console.log(user);

	// maak de query

	// haal de mogelijke matches uit de database

	// maak je klaar om te laten zien om de match pagina


}

module.exports = { getMatch }
