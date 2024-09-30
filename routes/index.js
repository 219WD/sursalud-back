const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const roleAuthorization = require('../middlewares/roleAuthorization'); 
const User = require('../model/User');

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
        // Token con expiración de 3 horas
        const token = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: '3h' });
        return res.json({ token });
      });
    } catch(e) {
      return next(e);
    }
  })(req, res, next);
});

// Ruta para obtener todos los usuarios (solo admin)
router.get('/users/findAllUsers', 
  passport.authenticate('jwt', { session: false }), 
  roleAuthorization(['admin']), 
  async (req, res, next) => {
    try {
      const users = await User.find({}, '-password'); // Excluir el campo de contraseña
      res.json(users);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
  }
);

// Ruta para promover un usuario a moderador (solo admin)
router.put('/users/upgradeRole/:userId', 
  passport.authenticate('jwt', { session: false }), 
  roleAuthorization(['admin']), 
  async (req, res, next) => {
    const { userId } = req.params;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Verificar si el usuario ya es moderador
      if (user.role === 'moderator') {
        return res.status(400).json({ message: 'El usuario ya es moderador' });
      }

      user.role = 'moderator';
      await user.save();

      res.json({ message: 'Usuario promovido a moderador exitosamente' });
    } catch (error) {
      console.error('Error al promover usuario:', error);
      res.status(500).json({ message: 'Error al actualizar el rol del usuario' });
    }
  }
);

// Ruta para eliminar un usuario (solo admin)
router.delete('/users/deleteUser/:userId', 
  passport.authenticate('jwt', { session: false }), 
  roleAuthorization(['admin']), 
  async (req, res, next) => {
    const { userId } = req.params;

    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
  }
);

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
