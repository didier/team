function getProfilePage (req, res, next) {

  db.collection('interests').find().toArray(done)

  function done(err, data) {
    if (err) {
      next (err)
    } else {
      res.render('account.ejs', {
        data: data
      })

    }
  }
}
