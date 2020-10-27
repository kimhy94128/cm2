const express = require('express');
const router = express.Router();
const db = require('../db');

// 자주 사용하는 쿼리
const getSidebar = `SELECT * FROM sidebar;`
const totalUser = `SELECT * FROM users;`

// 회원 리스트
router.get('/', (req, res) => {
  let search = '';
  if(req.query.q !== undefined){
    search = `WHERE name like '%${req.query.q}%'`
  };
  const getUsers = `SELECT uid, name, gender, phone, DATE_FORMAT(birth,'%Y-%m-%d') AS birth, DATE_FORMAT(regdate,'%Y-%m-%d') AS regdate, address, p_name, p_phone, memo, type, major, status, point from users ${search};`
  db.query(getSidebar + getUsers + totalUser, (err, result) => {
    if(err) console.log(err);
    const [ sidebar, users, totalUsers ] = result;
    res.render('pages/members', { title: '회원목록', sidebar, users, totalUsers })
  });
});

// 회원 등록
router.post('/regist', (req, res) => {
  db.query('INSERT INTO users SET ?;', [req.body], (err, result) => {
    if(err) console.log(err);
    const uid = result.insertId;
    res.redirect(`/users/${uid}`);
  })
});

// 회원정보 수정
router.post('/update', (req, res) => {
  db.query('UPDATE users SET ? WHERE uid = ?;', [req.body, req.body.uid], (err, result) => {
    if(err) console.log(err);
    res.redirect('/users');
  })
})

// 회원 상세
router.get('/:uid', (req, res) => {
  const { uid } = req.params
  const getUsers = `SELECT uid, name, gender, phone, DATE_FORMAT(birth,'%Y-%m-%d') AS birth, DATE_FORMAT(regdate,'%Y-%m-%d') AS regdate, address, p_name, p_phone, memo, type, major, status, point from users WHERE uid = ?;`
  const typeList = `SELECT distinct type FROM subjects;`
  const subjectList = `SELECT * FROM subjects;`
  const paymentList = `SELECT pid, payment.uid, payment.type, DATE_FORMAT(date,'%Y-%m-%d') AS date, name, amount FROM payment LEFT JOIN users ON payment.uid = users.uid WHERE att_no is null;`
  db.query(getSidebar + getUsers + typeList + subjectList + paymentList, [uid], (err, result) => {
    if(err) console.log(err);
    const [ sidebar, users, types, subject, payment ] = result;
    res.render('pages/profile', { title: `회원상세`, sidebar, user: users[0], types, subject, payment })
  });
});




module.exports = router;
