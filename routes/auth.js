const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../db');
const bcrypt = require('bcrypt');

// 회원가입
router.post('/register', async (req, res) => {
  const { userID, password, name} = req.body;
  const hash = await bcrypt.hash(password, 12);
  const confirm = `SELECT * FROM users WHERE id = ?;`
  const regist = `INSERT INTO users SET ?;`
  const data = { userID, password: hash, name }

  db.query(confirm, [userID], (err, user) => {
    if(err) console.log(err);
    if(user[0] === undefined){
      db.query(regist, data, (err, result) => {
        console.log(result);
        res.redirect('/login');
      })
    } else {
      res.redirect('/regist');
    }
  })
});

// 로그인
router.post('/login', passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  successFlash: true
}))

router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
})

module.exports = router;
