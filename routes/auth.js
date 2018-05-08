const router = require("express").Router();
const passport = require("passport");
const User = require("../models/User");
const multer = require("multer");
const uploads = multer({ dest: './public/uploads' });


//mailing
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

///////////////////////////SIGN UP & CONFIRMATION/////////////////////////////////////
router.get('/signup', (req, res) => {
    res.render('auth/signup', { error: req.body.error });
});

//crear usuario y enviar correo
router.post('/signup', (req, res) => {
    if (req.body.password !== req.body.password2) {
        return res.render("auth/signup", { info: "Las contraseñas no coinciden :(" })
    }
    User.register(new User({ email: req.body.email }), req.body.password, function(err, account) {
        if (err) {
            return res.render("auth/signup", { info: "Ese correo ya está registrado :(" });
        }
        const authenticate = User.authenticate();

        let message = {
            from: process.env.EMAIL_USER,
            to: req.body.email,
            subject: "Tu código de confirmación",
            html: `<a href="http://localhost:3000/confirm/${account.authToken}">Hey-yo, confirma again :* </a>`
        };
        transporter.sendMail(message);
        res.render('/auth/verification');
        authenticate(req.body.email, req.body.password, function(err, result) {
            if (err) return res.send(err);
            return res.redirect('/');
        });
    });
});

//link de confirmación
router.get('/confirm/:authToken', function(req, res) {
    User.findOneAndUpdate({ authToken: req.params.authToken }, { $set: { isAuthenticated: "True" } })
        .then(() => res.redirect("/"))
        .catch(e => console.log(e))
});

//CHECAR****
router.get('/email-verification', (req, res) => {
    res.render('auth/login', { error: req.body.error });
});

///////////////////////////LOGIN/////////////////////////////////////
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/profile')
    }
    return next();
};

function isNotAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/login');
};


router.get('/profile', isNotAuth, (req, res, next) => {
    User.findById(req.user._id)
        //.populate('products')
        .then(user => {
            res.render('auth/profile', user);
        })
        .catch(e => next(e))

});



router.get('/login', isAuthenticated, (req, res) => {
    res.render('auth/login', { error: req.body.error });
});

// router.post('/login', passport.authenticate('local'), (req, res) => {
//     res.redirect('/profile');
// });

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/unauthorized'
}));

///////////////////////////LOG OUT/////////////////////////////////////
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

///////////////////////////SUBIR FOTO DE PERFIL/////////////////////////////////////
router.post('/profile', uploads.single('profilePic'), (req, res, next) => {
    req.body.profilePic = '/uploads/' + req.file.filename;
    User.findByIdAndUpdate(req.user._id, req.body)
        .then(() => {
            req.user.message = "Actualizado";
            res.render('auth/profile', req.user);
        })
        .catch(e => next(e));
});




module.exports = router;