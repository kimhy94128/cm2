const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../db');

module.exports = new LocalStrategy({
  usernameField: 'userID',
  passwordField: 'password',
  passReqToCallback: true
}, (req, userID, password, done) => {
  db.query('SELECT * FROM account WHERE userID = ?;', [userID], async (err, user) => {
    if(user[0] === undefined){
      done(null, false, {message: '등록되지 않은 회원입니다.'})
    } else {
      const result = await bcrypt.compare(password, user[0].password);
      if(result){
        done(null, user[0]);
      } else {
        done(null, false, '비밀번호가 일치하지 않습니다.')
      }
    }
  })
})