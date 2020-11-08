var express = require('express');
var router = express.Router();


function isLogin(req, res, next) {            //middleware check session
    if (req.session.user) {
      next();
    } else {
      res.redirect('/');
    }
  }


/* GET users listing. */
router.get('/', isLogin, function (req, res, next) {
    res.render('index', { user: req.session.user }); // merender index.js dengan permintaan sesi user
  });
  
  router.get('/logout', function (req, res, next) {
    req.session.destroy(function (err) {             //session hancur atau logout
      res.redirect("/")
      // cannot access session here
    })
  });

module.exports = router;