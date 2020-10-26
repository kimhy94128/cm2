const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res, next) => {
  const getSidebar = `SELECT * FROM sidebar;`
  const subjectList = `SELECT * FROM subjects LEFT JOIN teachers ON subjects.t_id = teachers.id;`
  db.query(getSidebar + subjectList, (err, result) => {
    if(err) console.log(err);
    const [ sidebar, subject ] = result;
    res.render('pages/subject', { title: '수업관리', sidebar, subject, users : '' })
  })
});

module.exports = router;
