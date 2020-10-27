const express = require('express');
const passport = require('passport');
const router = express.Router();
const db = require('../db');

// 자주 사용하는 쿼리
const getSidebar = `SELECT * FROM sidebar;`
const totalUser = `SELECT * FROM users;`
const newUser = `SELECT * FROM users WHERE regdate = CURDATE();`
const nonpayer = 'SELECT distinct uid FROM attend WHERE pid IS NULL;'


// 홈
router.get('/', (req, res) => {
  db.query(getSidebar + totalUser + newUser + nonpayer, (err, result) => {
    const [ sidebar, totalUsers, newUsers, nonpayers ] = result;
    res.render('pages/dashboard', {
      title: '홈',
      sidebar,
      account: req.user,
      users: '',
      totalUsers,
      newUsers,
      nonpayers
    });
  });
});

router.get('/tables', (req, res, next) => {
  res.render('pages/tables', { title: 'Express', account: req.user });
});

router.get('/login', (req, res, next) => {
  res.render('pages/login', { title: '로그인' });
});

router.get('/icons', function(req, res, next) {
  const getSidebar = `SELECT * FROM sidebar;`
  db.query(getSidebar, (err, sidebar) => {
    res.render('pages/icons', { title: 'Express', sidebar, users: '' });
  })
});

router.post('/api', (req, res) => {
  const { sid1, sid2, sid3 } = req.body;
  let price = 0;
  db.query('SELECT * FROM subjects WHERE sid = ?;', [sid1], (err, result) => {
    if(err) console.log(err);
    price = result[0].price;
    
    if(sid2 !== ''){
      db.query('SELECT * FROM subjects WHERE sid = ?;', [sid2], (err, result) => {
        price += result[0].price;

        if(sid3 !== ''){
          db.query('SELECT * FROM subjects WHERE sid = ?;', [sid3], (err, result) => {
            price += result[0].price;
            res.json(price);
          })
        } else {
          res.json(price);
        }
      })
    } else {
      res.json(price);
    }
  })
})

module.exports = router;
