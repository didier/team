function getEditProfilePage (req, res, next) {

  db.collection('interests').insertOne({
    interest : req.body.interest
  }, done)

  function done(err, data) {
    if (err) {
      next(err)
    } else {
      console.log(req.body)
      res.redirect('/account')
    }
  }
}
