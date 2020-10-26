const express = require('express');
const router = express.Router();
const db = require('../db');

// 자주 사용하는 쿼리
const getSidebar = `SELECT * FROM sidebar;`

// 회원 리스트
router.get('/', (req, res) => {
  let search = '';
  if(req.query.q !== undefined){
    search = `WHERE name like '%${req.query.q}%'`
  };
  const getUsers = `SELECT uid, name, gender, phone, DATE_FORMAT(birth,'%Y-%m-%d') AS birth, DATE_FORMAT(regdate,'%Y-%m-%d') AS regdate, address, p_name, p_phone, memo, type, subject, status, point from users ${search};`
  db.query(getSidebar+ getUsers, (err, result) => {
    if(err) console.log(err);
    const [ sidebar, users ] = result;
    res.render('pages/members', { title: '회원목록', sidebar, users })
  });
});

router.get('/:uid', (req, res) => {
const { uid } = req.params;
  const userName = `SELECT name FROM users WHERE uid = ?;`
  db.query(getSidebar + userName, [uid], (err, result) => {
    if(err) console.log(err);
    const [ sidebar, user ] = result;
    res.render('pages/subject_regist', { title: '수강신청', sidebar, user: user[0]});
  })
})


module.exports = router;
