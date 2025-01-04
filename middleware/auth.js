const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please log in first');
  res.redirect('/login');
};

const isMember = (req, res, next) => {
  if (req.user && req.user.isMember) {
    return next();
  }
  req.flash('error', 'Members only access');
  res.redirect('/');
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  req.flash('error', 'Admin only access');
  res.redirect('/');
};

module.exports = { isAuthenticated, isMember, isAdmin };