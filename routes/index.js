const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const roleAuthorization = require('../middlewares/roleAuthorization'); 

// Rutas
router.get('/', function(req, res, next) {
  res.send('Hello World');
});

router.post('/signup', passport.authenticate('signup', { session: false }), async (req, res, next) => {
  res.json({
    message: 'Signup successful',
    user: req.user,
  });
});

router.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user) {
        console.log(err);
        const error = new Error('new Error');
        return next(error);
      }

      req.login(user, { session: false }, async (err) => {
        if (err) return next(err);
        const body = { _id: user._id, email: user.email, role: user.role };
        const token = jwt.sign({ user: body }, process.env.JWT_SECRET);
        return res.json({ token });
      });
    } catch(e) {
      return next(e);
    }
  })(req, res, next);
});

router.get('/admin', passport.authenticate('jwt', { session: false }), roleAuthorization(['admin']), (req, res, next) => {
  res.json({
    message: 'Welcome Admin',
  });
});

router.get('/moderator', passport.authenticate('jwt', { session: false }), roleAuthorization(['moderator']), (req, res, next) => {
  res.json({
    message: 'Welcome Moderator',
  });
});

router.get('/user', passport.authenticate('jwt', { session: false }), roleAuthorization(['user']), (req, res, next) => {
  res.json({
    message: 'Welcome User',
  });
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  res.json({
    message: 'You did it!',
    user: req.user,
    token: req.query.secret_token,
  });
});

module.exports = router;
