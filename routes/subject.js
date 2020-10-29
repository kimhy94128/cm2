const express = require('express');
const router = express.Router();
const db = require('../db');
const { isLoggedIn, isNotLoggedIn } = require('./middleware');

// 자주 사용하는 쿼리
const getSidebar = `SELECT * FROM sidebar;`

router.get('/', isLoggedIn, (req, res, next) => {
  const subjectList = `SELECT * FROM subjects LEFT JOIN teachers ON subjects.tid = teachers.tid WHERE subjects.account = '${req.user.userID}';`
  const teacherList = `SELECT * FROM teachers WHERE account = '${req.user.userID}';`
  const userList = `SELECT attend.sid, s_name, count(*) as count FROM attend LEFT JOIN subjects ON attend.sid = subjects.sid WHERE attend.account = '${req.user.userID}' GROUP BY sid;`
  const weeks = ['월', '화', '수', '목', '금', '토', '일'];
  db.query(getSidebar + subjectList + teacherList + userList, (err, result) => {
    if(err) console.log(err);
    const [ sidebar, subject, teachers, users ] = result;
    res.render('pages/subject', {
      title: '수업관리',
      account: req.user,
      sidebar, subject, users, teachers, weeks })
  })
});

router.post('/regist', isLoggedIn, (req, res) => {
  const { type, s_name, tid, price, week, time } = req.body;
  const data = {
    type, s_name, tid, price, time,
    week: week.toString(),
    account: req.user.userID,
  }
  db.query('INSERT INTO subjects SET ?;', data, (err, result) => {
    if(err) console.log(err);
    console.log(data);
    res.redirect('/subject');
  })
})

router.post('/update', isLoggedIn, (req, res) => {
  const { type, s_name, tid, price, week, time } = req.body;
  const data = {
    type, s_name, tid, price, time,
    week: week.toString()
  }
  db.query('UPDATE subjects SET ? WHERE sid = ?;', [data, req.body.sid], (err, result) => {
    if(err) console.log(err);
    res.redirect('/subject');
  })
})

module.exports = router;
