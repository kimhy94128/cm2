const express = require('express');
const router = express.Router();
const db = require('../db');

// 자주 사용하는 쿼리
const getSidebar = `SELECT * FROM sidebar;`

router.get('/', (req, res) => {
  const attendList = `SELECT no, users.uid, name, subjects.type, s_name, payment.type AS ptype, amount, total_price, DATE_FORMAT(started,'%Y-%m-%d') AS started, DATE_FORMAT(ended,'%Y-%m-%d') AS ended, DATE_FORMAT(date,'%Y-%m-%d') AS date FROM attend
  LEFT JOIN users ON attend.uid = users.uid
  LEFT JOIN subjects ON attend.sid = subjects.sid
  LEFT OUTER JOIN payment ON attend.no = payment.att_no
  ORDER BY started DESC;`
  db.query(getSidebar + attendList, (err, result) => {
    if(err) console.log(err);
    const [ sidebar, attend ] = result;
    res.render('pages/attend', {
      title: '수강목록',
      sidebar,
      attend
    })
  })
})

router.post('/', (req, res) => {
  const { uid, type, major, subject1, subject2, subject3, total_price, started, ended, pid } = req.body;
  const updateType = 'UPDATE users SET type = ?, major = ? WHERE uid = ?;'
  const attend = 'INSERT INTO attend SET ?;'

  db.query(updateType, [type, major, uid ], (err, result) => {
    if(err) console.log(err);

    const datas = {
      sid: subject1,
      sid2: subject2 !== ''? subject2 : null,
      sid3: subject3 !== ''? subject2 : null,
      pid: pid !== '' ? pid : null,
      total_price, started, ended, uid,
    }
    db.query(attend, datas, (err, result) => {
      if(err) console.log(err);
      if(pid){
        db.query('UPDATE payment SET att_no = ? WHERE pid = ?;', [result.insertId, pid], (err, result) => {
          if(err) console.log(err);
          res.redirect(`/users/${uid}`)
        })
      } else {
        res.redirect(`/users/${uid}`)
      }
    })
  })
})

router.get('/:uid', (req, res) => {
const { uid } = req.params;
  const userName = `SELECT name, type FROM users WHERE uid = ?;`
  db.query(getSidebar + userName, [uid], (err, result) => {
    if(err) console.log(err);
    const [ sidebar, user ] = result;
    res.render('pages/subject_regist', { title: '수강신청', sidebar, user: user[0]});
  })
})


module.exports = router;
