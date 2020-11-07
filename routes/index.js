var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;






function isLogin(req, res, next) {            //middleware check session
  if (req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
}



/* GET home page. */
module.exports = (pool) => {
  router.get('/', function (req, res, next) {
    res.render('login', { LoginMessage: req.flash('loginMessage') }); // flash dipake dsni juga
  });


  //==========================================================================================================//
  router.get('/register', function (req, res, next) {
    res.render('register')                                          // flash dipake dsni juga
  });

  router.post('/register', function (req, res, next) {
    const { email, firstname, lastname, password } = req.body
    
 
  //==bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) { }
      bcrypt.hash(password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    if (err) return res.send(err)
    pool.query('INSERT INTO users (email, firstname, lastname, password) VALUES ($1, $2, $3, $4)', // sintaks ppostgresql pool query --> perintah --> values --> query binding -- callback --> error
      [email, firstname, lastname, hash], // query binding password ganti ke hash
      (err, data) => {
        if (err) return res.send(err)
        res.json(data.rows);

      });
  });
});
//============================================================================================================//

router.post('/login', function (req, res, next) {
  const { email, password } = req.body

  pool.query('SELECT * FROM users WHERE email = $1',// -----------> Scan email database
    [email], (err, data) => {                                //check email 
      if (err) return res.send(err)
      if (data.rows.length == 0) {                  //------------------>  scan = 0 maka muncul selanjutnya pesan "Flash"
        req.flash('loginMessage', 'User Not Found')  // saat email tidak ada
        return res.redirect('/')
      }                                              //return res.send('user not found')------>"sebelum pake flash"
      //----------------- jika email tembus lalu di bandingkan dengan password-----------------//      
      //                                            
      bcrypt.compare(password, data.rows[0].password, function (err, result) {
        if (err) return res.send(err)
        if (!result) {                               //saat data password tidak ada

          req.flash('loginMessage', 'User or Password is Wrong anjink')
          return res.redirect('/')
        }



        //return res.send('user or password is wrong') ----> sebelum pake flash

        req.session.user = data.rows[0]               //session

        res.redirect('/home')
        // result == selalu dalam keadaan true
      });
    });
});

router.get('/home', isLogin, function (req, res, next) {
  res.render('index', { user: req.session.user }); // merender index.js dengan permintaan sesi user
});

router.get('/logout', function (req, res, next) {
  req.session.destroy(function (err) {             //session hancur atau logout
    res.redirect("/")
    // cannot access session here
  })
});


return router;
}