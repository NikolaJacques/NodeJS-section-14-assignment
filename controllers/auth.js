const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    loginError: false,
    user: {
      email: '',
      password: ''
    },
    isAuthenticated: req.session.isAuthenticated
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email: email, password: password});
    if (user){
      req.session.user = user;
      req.session.isAuthenticated = true;
      res.redirect('/');
    } else {
      res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        loginError: true,
        user: {
          email,
          password
        },
        isAuthenticated: req.session.isAuthenticated
      });
    }
  }
  catch(err){
    console.log(err);
  }
};
