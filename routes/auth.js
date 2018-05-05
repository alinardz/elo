const router = require('express').Router();
const passport = require('passport');
const User = require('../models/User');
//¿Usamos cloudinary?
const multer = require('multer');
const uploads = multer({ dest: './public/uploads' })

//const Product????

//si el usuario está autenticado *****
function isAuth(req, res, next) {
    if (req.isAuth()) {
        return res.redirect('/')
    }
    return next();
};

//si el usuario no está autenticado
function isNotAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/login');
}

//??
router.get('/profile', isNotAuth, (req, res, next) => {
    User.findById(req.user._id)
        .populate('products')
        .then(user => {
            res.render('auth/profile', user);
        })
        .catch(e => next(e))
});

router.post('/profile', uploads.single('profilePic'), (req, res, next) => {
    req.body.profilePic = '/uploads/' + req.file.filename;
    User.findByIdAndUpdate(req.user._id, req.body)
        .then(() => {
            req.user.message = "Actualizado";
            req.render('auth/profile', req.user);
        })
        .catch(e => next(e));
});

//cuando te loggeas out, te regresa a login
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

//??
router.get('login', isAuth, (req, res) => {
    res.render('auth/login', { error: req.body.error });
});

//te loggea in y te manda a profile
router.post('login', passport.authenticate('local'), (req, res) => {
    res.redirect('/profile');
});

//te manda a signup
router.get('/signup', (req, res) => {
    res.render('auth/signup', { error: req.body.error });
});

router.post('/signup', (req, res) => {
    User.register(req.body, req.body.password, function(err, user) {
        if (err) return res.send(err);
        const authenticate = User.authenticate();
        authenticate(req.body.email, req.body.password, function(err, result) {
            if (err) return res.send(err);
            return res.redirect('/profile');
        })
    });
});

module.exports = router;