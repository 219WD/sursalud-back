function roleAuthorization(roles) {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next();
    } else {
      return res.status(403).json({ message: 'Forbidden' });
    }
  };
}

module.exports = roleAuthorization;
