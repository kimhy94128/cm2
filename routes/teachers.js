const express = require('express');
const router = express.Router();
const db = require('../db');

// 자주 사용하는 쿼리
const getSidebar = `SELECT * FROM sidebar;`
const totalUser = `SELECT * FROM users;`

router.get('/', (req, res, next) => {
  const teacherList = `SELECT tid, name, gender, phone, account, bank, DATE_FORMAT(birth,'%Y-%m-%d') AS birth FROM teachers;`
  db.query(getSidebar + teacherList + totalUser, (err, result) => {
    if(err) console.log(err);
    const [ sidebar, teachers, totalUsers ] = result;
    res.render('pages/teachers', { title: '강사관리', sidebar, teachers, users: '', totalUsers})
  })
});

router.post('/regist', (req, res) => {
  db.query('INSERT INTO teachers SET ?;', [req.body], (err, result) => {
    if(err) console.log(err);
    res.redirect('/teachers');
  })
})

router.post('/update', (req, res) => {
  db.query('UPDATE teachers SET ? WHERE tid = ?;', [ req.body, req.body.tid ], (err, result) => {
    if(err) console.log(err);
    res.redirect('/teachers');
  })
})

module.exports = router;
