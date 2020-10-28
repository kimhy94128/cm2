const express = require('express');
const router = express.Router();
const db = require('../db');

// 자주 사용하는 쿼리
const getSidebar = `SELECT * FROM sidebar;`

router.get('/', (req, res, next) => {
  const subjectList = `SELECT * FROM subjects LEFT JOIN teachers ON subjects.tid = teachers.tid;`
  const teacherList = `SELECT * FROM teachers;`
  db.query(getSidebar + subjectList + teacherList, (err, result) => {
    if(err) console.log(err);
    const [ sidebar, subject, teachers ] = result;
    res.render('pages/subject', { title: '수업관리', sidebar, subject, users : '', teachers })
  })
});

router.post('/', (req, res) => {
  console.log(req);
})

router.post('/regist', (req, res) => {
  db.query('INSERT INTO subjects SET ?;', [req.body], (err, result) => {
    if(err) console.log(err);
    res.redirect('/subject');
  })
})

router.post('/update', (req, res) => {
  db.query('UPDATE subjects SET ? WHERE sid = ?;', [req.body, req.body.sid], (err, result) => {
    if(err) console.log(err);
    res.redirect('/subject');
  })
})

module.exports = router;
