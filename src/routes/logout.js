const postLogout = (req, res) => {
	req.session.destroy()
	res.redirect('/login')
}

module.exports = { postLogout }
