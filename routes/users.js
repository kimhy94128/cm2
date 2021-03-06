const express = require('express');
const router = express.Router();
const db = require('../db');
const { isLoggedIn, isNotLoggedIn } = require('./middleware');

// 자주 사용하는 쿼리
const getSidebar = `SELECT * FROM sidebar;`

// 회원 리스트
router.get('/',isLoggedIn, (req, res) => {
  let search = '';
  if(req.query.q !== undefined){
    search = `AND name like '%${req.query.q}%'`
  };
  const totalUser = `SELECT * FROM users WHERE account = '${req.user.userID}';`
  const getUsers = `SELECT uid, name, gender, phone, DATE_FORMAT(birth,'%Y-%m-%d') AS birth, DATE_FORMAT(regdate,'%Y-%m-%d') AS regdate, address, p_name, p_phone, memo, type, major, status, point from users WHERE isDeleted = 0 ${search} AND account = '${req.user.userID}';`
  db.query(getSidebar + getUsers + totalUser, (err, result) => {
    if(err) console.log(err);
    const [ sidebar, users, totalUsers ] = result;
    res.render('pages/members', { title: '회원목록', account: req.user, sidebar, 
    users: users === undefined ? '' : users, 
    totalUsers: totalUsers === undefined ? '' : totalUsers
    })
  });
});

// 회원 등록
router.post('/regist', isLoggedIn, (req, res) => {
  req.body.account = req.user.userID
  db.query('INSERT INTO users SET ?;', [req.body], (err, result) => {
    if(err) console.log(err);
    const uid = result.insertId;
    res.redirect(`/users/${uid}`);
  })
});

// 회원정보 수정
router.post('/update', isLoggedIn, (req, res) => {
  db.query('UPDATE users SET ? WHERE uid = ?;', [req.body, req.body.uid], (err, result) => {
    if(err) console.log(err);
    res.redirect('/users');
  })
})

router.post('/pay', isLoggedIn, (req, res) => {
  const { uid, att_no, type, date, amount } = req.body;
  const data = {
    uid, type, date, amount,
    att_no: att_no === '' ? null : att_no,
    account: req.user.userID
  }
  db.query(`INSERT INTO payment SET ?;`, data, (err, result) => {
    if(err) console.log(err);
    console.log(result);

    if(att_no !== null){
      const pid = result.insertId;
      db.query('UPDATE attend SET pid = ? WHERE no = ?;', [pid, att_no], (err, result) => {
        if(err) console.log(err);
        res.redirect(req.headers.referer)
      })
    } else {
      res.redirect(req.headers.referer)
    }
  })
})

// 회원 삭제
router.post('/delete', isLoggedIn, (req, res) => {
  const { uid } = req.body;
  db.query('UPDATE users SET isDeleted = 1 WHERE uid = ?;', [uid], (err, result) => {
    if(err) console.log(err);
    res.redirect('/users');
  })
})

// 회원 상세
router.get('/:uid', isLoggedIn, (req, res) => {
  const { uid } = req.params
  const getUsers = `SELECT uid, name, gender, phone, DATE_FORMAT(birth,'%Y-%m-%d') AS birth, DATE_FORMAT(regdate,'%Y-%m-%d') AS regdate, address, p_name, p_phone, memo, type, major, status, point from users WHERE uid = ? AND account = '${req.user.userID}';`
  const typeList = `SELECT distinct type FROM subjects WHERE account = '${req.user.userID}';`
  const subjectList = `SELECT * FROM subjects WHERE account = '${req.user.userID}';`
  const paymentList = `SELECT pid, payment.uid, payment.type, DATE_FORMAT(date,'%Y-%m-%d') AS date, name, amount FROM payment LEFT JOIN users ON payment.uid = users.uid WHERE att_no is null AND payment.account = '${req.user.userID}';`
  const attendList = `SELECT no, s_name, DATE_FORMAT(started,'%Y-%m-%d') AS started, DATE_FORMAT(ended,'%Y-%m-%d') AS ended, total_price FROM attend LEFT JOIN subjects ON attend.sid = subjects.sid WHERE uid = ? AND pid is Null AND attend.account = '${req.user.userID}' ORDER BY started;`
  db.query(getSidebar + getUsers + typeList + subjectList + paymentList + attendList, [uid, uid], (err, result) => {
    if(err) console.log(err);
    const [ sidebar, users, types, subject, payment, attend ] = result;
    res.render('pages/profile', { title: `회원상세`, sidebar, account: req.user, user: users[0], types, subject, payment, attend })
  });
});




module.exports = router;
