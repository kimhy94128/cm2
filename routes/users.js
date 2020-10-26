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

// 회원 등록
router.get('/regist', (req, res) => {
  db.query(getSidebar, (err, result) => {
    if(err) console.log(err);
    const sidebar = result;
    res.render('pages/regist', { title: '회원등록', sidebar, users: '' })
  });
});

// 회원 등록
router.post('/regist', (req, res) => {
  db.query('INSERT INTO users SET ?;', [req.body], (err, result) => {
    if(err) console.log(err);
    const uid = result.insertId;
    res.redirect(`/attend/${uid}`);
  })
});

// 회원 상세
router.get('/:uid', (req, res) => {
  const { uid } = req.params
  const getUsers = `SELECT uid, name, gender, phone, DATE_FORMAT(birth,'%Y-%m-%d') AS birth, DATE_FORMAT(regdate,'%Y-%m-%d') AS regdate, address, p_name, p_phone, memo, type, subject, status, point from users WHERE uid = ?;`
  db.query(getSidebar + getUsers, [uid], (err, result) => {
    if(err) console.log(err);
    const [ sidebar, users ] = result;
    res.render('pages/profile', { title: `회원상세`, sidebar, user: users[0] })
  });
});




module.exports = router;
