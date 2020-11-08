function isLogin(req, res, next) {            //middleware check session
    if (req.session.user) {
      next();
    } else {
      res.redirect('/');
    }
  }