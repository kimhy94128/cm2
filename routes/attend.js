const express = require('express');
const router = express.Router();
const db = require('../db');

// 자주 사용하는 쿼리
const getSidebar = `SELECT * FROM sidebar;`

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
      total_price, started, ended, uid, pid
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
