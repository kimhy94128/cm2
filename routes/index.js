const express = require('express');
const passport = require('passport');
const router = express.Router();
const db = require('../db');
const { isLoggedIn, isNotLoggedIn } = require('./middleware');

// 자주 사용하는 쿼리
const getSidebar = `SELECT * FROM sidebar;`

// 홈
router.get('/', isLoggedIn, (req, res) => {
  const account = req.user.userID;
  const weeks = ['일','월', '화', '수', '목', '금', '토'];
  const d = new Date().getDay()

  let totalUsers = `SELECT distinct uid FROM attend WHERE account = '${account}' AND MONTH(started) = MONTH(NOW());`
  let totalUsersPrev = `SELECT distinct uid FROM attend WHERE account = '${account}' AND MONTH(started) = MONTH(NOW())-1;`
  let newUsers = `SELECT * FROM users WHERE MONTH(regdate) = MONTH(NOW()) AND account = '${account}';`
  let newUsersPrev = `SELECT * FROM users WHERE MONTH(regdate) = MONTH(NOW())-1 AND account = '${account}';`
  let nonpayers = `SELECT distinct uid FROM attend WHERE pid IS NULL AND account = '${account}';`
  let todayUsers = `SELECT distinct attend.uid, subjects.s_name, week FROM attend LEFT JOIN users ON attend.uid = users.uid LEFT JOIN subjects ON attend.sid = subjects.sid WHERE week like '%${weeks[d]}%' AND attend.account = '${account}';`
  let todaySubjects = `SELECT * FROM subjects WHERE week like '%${weeks[d]}%' AND account = '${account}';`
  let subjects = `SELECT * FROM subjects WHERE account = '${account}';`
  let usersPerSubjects = `SELECT sid, count(*) as count FROM attend WHERE MONTH(started) = MONTH(NOW()) AND account = '${account}' GROUP BY sid;`
  let usersPerSubjectsPrev = `SELECT sid, count(*) as count FROM attend WHERE MONTH(started) = MONTH(NOW())-1 AND account = '${account}' GROUP BY sid;`
  let teachers = `SELECT * FROM teachers WHERE account = '${account}';`
  let usersPerTeachers = `SELECT subjects.tid, count(*) as count FROM subjects LEFT JOIN teachers ON subjects.tid = teachers.tid LEFT JOIN attend ON attend.sid = subjects.sid WHERE MONTH(started) = MONTH(NOW()) AND subjects.account = '${account}' GROUP BY attend.sid;`

  db.query(getSidebar + totalUsers + totalUsersPrev + newUsers + newUsersPrev + nonpayers + todayUsers + todaySubjects + subjects + usersPerSubjects + usersPerSubjectsPrev + teachers + usersPerTeachers, (err, result) => {
    let [ sidebar, totalUsers, totalUsersPrev, newUsers, newUsersPrev, nonpayers, todayUsers, todaySubjects, subjects, usersPerSubjects, usersPerSubjectsPrev, teachers , usersPerTeachers ] = result;
    res.render('pages/dashboard', {
      title: '홈',
      account: req.user,
      sidebar,
      totalUsers,
      totalUsersPrev,
      newUsers,
      newUsersPrev,
      nonpayers,
      todayUsers,
      todaySubjects,
      subjects,
      usersPerSubjects,
      usersPerSubjectsPrev,
      teachers,
      usersPerTeachers
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
