const express = require('express');
const router = express.Router();
const db = require('../db');
const { isLoggedIn, isNotLoggedIn } = require('./middleware');

// 자주 사용하는 쿼리
const getSidebar = `SELECT * FROM sidebar;`

router.get('/', isLoggedIn, (req, res, next) => {
  const teacherList = `SELECT tid, name, gender, phone, account_number, bank, DATE_FORMAT(birth,'%Y-%m-%d') AS birth FROM teachers WHERE account = '${req.user.userID}';`
  const totalUser = `SELECT * FROM users WHERE account = '${req.user.userID}';`
  db.query(getSidebar + teacherList + totalUser, (err, result) => {
    if(err) console.log(err);
    const [ sidebar, teachers, totalUsers ] = result;
    res.render('pages/teachers', { title: '강사관리', account: req.user, sidebar, teachers, users: '', totalUsers})
  })
});

router.post('/regist', isLoggedIn, (req, res) => {
  req.body.account = req.user.userID
  db.query('INSERT INTO teachers SET ?;', [req.body], (err, result) => {
    if(err) console.log(err);
    res.redirect('/teachers');
  })
})

router.post('/update', isLoggedIn, (req, res) => {
  db.query('UPDATE teachers SET ? WHERE tid = ?;', [ req.body, req.body.tid ], (err, result) => {
    if(err) console.log(err);
    res.redirect('/teachers');
  })
})

module.exports = router;
