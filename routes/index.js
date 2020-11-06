var express = require('express');
var router = express.Router();

/* GET home page. */
module.exports = (pool)=> {
router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/register', function(req, res, next) {
  const {username, email, firstname, lastname, password} = req.body
  pool.query('INSERT INTO users (username, email, firstname, lastname, password) VALUES ($1, $2, $3, $4, $5)', [username, email, firstname, lastname,  password], (err, data) => {
    if(err) return res.send(err)
    res.json(data.rows);

  });
});


router.post('/login', function(req, res, next) {
  const {email, password} = req.body
});

return router;
}