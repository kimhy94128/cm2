const express = require('express');
const router = express.Router();
const db = require('../db');

// 자주 사용하는 쿼리
const getSidebar = `SELECT * FROM sidebar;`


// 출석부
router.get('/:sid', (req, res) => {
  const {sid} = req.params;
  const month = req.query.month || new Date().getMonth();
  const attendList = `SELECT name, subjects.type, s_name, DATE_FORMAT(started,'%m/%d') AS started, DATE_FORMAT(ended,'%m/%d') AS ended FROM attend
  LEFT JOIN users ON users.uid = attend.uid 
  LEFT JOIN subjects ON attend.sid = subjects.sid
  WHERE attend.sid = ? AND MONTH(started)-1 = ?;`
  const titleText = `SELECT distinct s_name, type from attend left join subjects on attend.sid = subjects.sid WHERE subjects.sid = ?;`
  db.query(getSidebar + attendList + titleText, [sid, month, sid], (err, result) => {
    if(err) console.log(err);
    const [sidebar, users, tit] = result;
    const title = `${tit[0].s_name} (${tit[0].type}) 출석부`

    const dateRange = () => {
      const days = [];
      const s_date = new Date('2020-10-01');
      const e_date = new Date('2020-10-31');

      while(s_date.getTime() <= e_date.getTime()){
        days.push(
          `${s_date.getFullYear()}-${s_date.getMonth()+1 < 10 ? `0${s_date.getMonth()+1}` : s_date.getMonth()+1}-${s_date.getDate() < 10 ? `0${s_date.getDate()}` : s_date.getDate()}`
        )
        s_date.setDate(s_date.getDate() + 1)
      }
      return days;
    }

    res.render('pages/rollbook', {
      title,
      sidebar,
      users,
      month,
      days: dateRange()
    })
  })
})


module.exports = router;
