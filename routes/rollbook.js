const express = require('express');
const router = express.Router();
const db = require('../db');
const { isLoggedIn, isNotLoggedIn } = require('./middleware');

// 자주 사용하는 쿼리
const getSidebar = `SELECT * FROM sidebar;`


// 출석부
router.get('/:sid', isLoggedIn, (req, res) => {
  const {sid} = req.params;
  const year = req.query.year || new Date().getFullYear();
  const month = req.query.month || new Date().getMonth();
  const attendList = `SELECT users.uid, name, subjects.type, s_name, DATE_FORMAT(started,'%m/%d') AS started, DATE_FORMAT(ended,'%m/%d') AS ended FROM attend
  LEFT JOIN users ON users.uid = attend.uid 
  LEFT JOIN subjects ON attend.sid = subjects.sid
  WHERE attend.sid = ? AND YEAR(started) = ? AND MONTH(started)-1 = ?
  AND attend.account = '${req.user.userID}';`
  const titleText = `SELECT distinct s_name, type, subjects.week, subjects.sid from attend left join subjects on attend.sid = subjects.sid WHERE subjects.sid = ? AND attend.account = '${req.user.userID}';`
  const rollbook = `SELECT * FROM rollbook WHERE account = '${req.user.userID}';`
  db.query(getSidebar + attendList + titleText + rollbook, [sid, year, month, sid], (err, result) => {
    if(err) console.log(err);
    const [sidebar, users, tit, rollbooks] = result;
    const title = `${tit[0].s_name} (${tit[0].type}) 출석부`

    const makeRollBook = (date) => {
      const days = [];
      if(date === undefined){
        date = new Date()
      } else {
        date = new Date(date)
      }
      
      const monthStart = new Date(date.setDate(1))
      date.setMonth(date.getMonth()+1)
      date.setDate(0)
      const monthEnd = date
    
      while(monthStart.getTime() <= monthEnd.getTime()){
        days.push(`${monthStart.getFullYear()}-${monthStart.getMonth()+1 < 10 ? `0${monthStart.getMonth()+1}` : monthStart.getMonth()+1}-${monthStart.getDate() < 10 ? `0${monthStart.getDate()}` : monthStart.getDate()}`);
        monthStart.setDate(monthStart.getDate()+1)
      }
      return days;
    }

    res.render('pages/rollbook', {
      title,
      tit,
      account: req.user,
      sidebar,
      users,
      month,
      days: makeRollBook(new Date().setMonth(month)),
      rollbooks
    })
  })
})

router.post('/check', (req, res) => {
  const data = req.body;
  data.account = req.user.userID
  db.query('INSERT INTO rollbook SET ?', [data], (err, result) => {
    if(err) console.log(err);
    res.status(200).json({ success: true })
  })
})
router.post('/delete', (req, res) => {
  const { uid, sid, date } = req.body;
  db.query('DELETE FROM rollbook WHERE uid = ? AND sid = ? AND date = ? AND account = ?;', [ parseInt(uid), parseInt(sid), date, req.user.userID], (err, result) => {
    if(err) console.log(err);
    res.status(200).json({ success: true })
  })
})


module.exports = router;
