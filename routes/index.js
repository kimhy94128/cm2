const express = require('express');
const passport = require('passport');
const router = express.Router();
const db = require('../db');

// 홈
router.get('/', (req, res) => {
  const getSidebar = `SELECT * FROM sidebar;`
  db.query(getSidebar, (err, sidebar) => {
    res.render('pages/dashboard', { title: 'Express', sidebar, account: req.user, users: '' });
  })
});

// router.get('/profile', (req, res, next) => {
//   res.render('pages/profile', { title: 'Express', user: req.user, account: req.user });
// });


router.get('/tables', (req, res, next) => {
  res.render('pages/tables', { title: 'Express', account: req.user });
});

router.get('/login', (req, res, next) => {
  res.render('pages/login', { title: '로그인' });
});

// router.get('/register', (req, res, next) => {
//   res.render('pages/register', { title: '회원가입' });
// });

router.get('/icons', function(req, res, next) {
  const getSidebar = `SELECT * FROM sidebar;`
  db.query(getSidebar, (err, sidebar) => {
    res.render('pages/icons', { title: 'Express', sidebar, users: '' });
  })
});

module.exports = router;
