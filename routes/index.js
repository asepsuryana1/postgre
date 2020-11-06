var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;






function isLogin (req,res,next){            //middleware check session
  if(req.session.user){
  next();
  }else{
  res.redirect('/');
  }
}
  
  

/* GET home page. */
module.exports = (pool) => {
  router.get('/', function (req, res, next) {
    res.render('login');
  });

  router.post('/register', function (req, res, next) {
    const { username, email, firstname, lastname, password } = req.body

    bcrypt.hash(password, saltRounds, function (err, hash) {
      // Store hash in your password DB.
      if (err) return res.send(err)
      pool.query('INSERT INTO users (username, email, firstname, lastname, password) VALUES ($1, $2, $3, $4, $5)', [username, email, firstname, lastname, hash], (err, data) => {
        if (err) return res.send(err)
        res.json(data.rows);

      });
    });
  });

  router.post('/login', function (req, res, next) {
    const { email, password } = req.body
    pool.query('SELECT * FROM users WHERE email = $1', [email], (err, data) => {
      if (err) return res.send(err)
      if (data.rows.length == 0) return res.send('user not found')
      bcrypt.compare(password, data.rows[0].password, function (err, result) {
        if (err) return res.send(err)
        if (!result) return res.send('user or password is wrong')

        req.session.user = data.rows[0]  //session

        res.redirect('/home')
        // result == true
      });
    });
  });

  router.get('/home', isLogin, function (req, res, next) {
    res.render('index', { user: req.session.user  }); //session
  });

  router.get('/logout', function (req, res, next) {
  req.session.destroy(function(err) {//session hancur atau logout
      res.redirect("/")
      // cannot access session here
    })
  }); 


  return router;
}