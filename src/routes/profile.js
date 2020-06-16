
function getProfilePage (req, res, next) {
res.status(200).render('profile-page')
}

module.exports = { getProfilePage }
