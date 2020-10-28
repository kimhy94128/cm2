const express = require('express');
const router = express.Router();
const db = require('../db');

// 자주 사용하는 쿼리
const getSidebar = `SELECT * FROM sidebar;`

router.get('/:sid', (req, res) => {
  const {sid} = req.params;
  const attendList = `SELECT name, DATE_FORMAT(started,'%m/%d') AS started, DATE_FORMAT(ended,'%m/%d') AS ended FROM attend
  LEFT JOIN users ON users.uid = attend.uid WHERE sid = ?;`
  db.query(getSidebar + attendList, [sid], (err, result) => {
    if(err) console.log(err);
    const [sidebar, users] = result;

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
      title: sid + '반 출석부',
      sidebar,
      users,
      days: dateRange()
    })
  })
})


module.exports = router;
