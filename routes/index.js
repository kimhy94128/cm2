const express = require('express');
const passport = require('passport');
const router = express.Router();
const db = require('../db');
const { isLoggedIn, isNotLoggedIn } = require('./middleware');

// 자주 사용하는 쿼리
const getSidebar = `SELECT * FROM sidebar;`

// 홈
router.get('/', isLoggedIn, (req, res) => {
  const totalUser = `SELECT * FROM users WHERE account = '${req.user.userID}';`
  const newUser = `SELECT * FROM users WHERE regdate = CURDATE() AND account = '${req.user.userID}';`
  const nonpayer = `SELECT distinct uid FROM attend WHERE pid IS NULL AND account = '${req.user.userID}';`
  const subjects = `SELECT * FROM subjects WHERE account = '${req.user.userID}'`
  const nowTotal = `SELECT attend.sid as sid, s_name, type, count(*) as count from subjects LEFT JOIN attend on subjects.sid = attend.sid WHERE MONTH(started) = MONTH(NOW()) AND account = '${req.user.userID}' GROUP BY subjects.sid;`
  const prevTotal = `SELECT attend.sid as sid, s_name, type, count(*) as count from subjects LEFT JOIN attend on subjects.sid = attend.sid  WHERE MONTH(started) = MONTH(NOW())-1 AND account = '${req.user.userID}' GROUP BY sid;`
  db.query(getSidebar + totalUser + newUser + nonpayer + nowTotal + prevTotal + subjects , (err, result) => {
    const [ sidebar, totalUsers, newUsers, nonpayers, nowTotals, prevTotals, subject ] = result;
    res.render('pages/dashboard', {
      title: '홈',
      account: req.user,
      sidebar,
      users: '',
      totalUsers,
      newUsers,
      nonpayers,
      nowTotals,
      prevTotals,
      subject
    });
  });
});

router.get('/login', isNotLoggedIn, (req, res, next) => {
  res.render('pages/login', { title: '로그인' });
});

router.get('/register', isNotLoggedIn, (req, res, next) => {
  res.render('pages/register', { title: '회원가입' });
});

router.post('/api', isLoggedIn, (req, res) => {
  const { sid1, sid2, sid3 } = req.body;
  let price = 0;
  db.query('SELECT * FROM subjects WHERE sid = ?;', [sid1], (err, result) => {
    if(err) console.log(err);
    price = result[0].price;
    
    if(sid2 !== ''){
      db.query('SELECT * FROM subjects WHERE sid = ?;', [sid2], (err, result) => {
        price += result[0].price;

        if(sid3 !== ''){
          db.query('SELECT * FROM subjects WHERE sid = ?;', [sid3], (err, result) => {
            price += result[0].price;
            res.json(price);
          })
        } else {
          res.json(price);
        }
      })
    } else {
      res.json(price);
    }
  })
})

module.exports = router;
