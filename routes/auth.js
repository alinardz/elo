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
            html: `<html style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">

            <head>
                <meta name="viewport" content="width=device-width" />
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <title>Confirma Elo</title>
            
            
                <style type="text/css">
                    img {
                        max-width: 100%;
                    }
                    
                    body {
                        -webkit-font-smoothing: antialiased;
                        -webkit-text-size-adjust: none;
                        width: 100% !important;
                        height: 100%;
                        line-height: 1.6em;
                    }
                    
                    body {
                        background-color: #f6f6f6;
                    }
                    
                    @media only screen and (max-width: 640px) {
                        body {
                            padding: 0 !important;
                        }
                        h1 {
                            font-weight: 800 !important;
                            margin: 20px 0 5px !important;
                        }
                        h2 {
                            font-weight: 800 !important;
                            margin: 20px 0 5px !important;
                        }
                        h3 {
                            font-weight: 800 !important;
                            margin: 20px 0 5px !important;
                        }
                        h4 {
                            font-weight: 800 !important;
                            margin: 20px 0 5px !important;
                        }
                        h1 {
                            font-size: 22px !important;
                        }
                        h2 {
                            font-size: 18px !important;
                        }
                        h3 {
                            font-size: 16px !important;
                        }
                        .container {
                            padding: 0 !important;
                            width: 100% !important;
                        }
                        .content {
                            padding: 0 !important;
                        }
                        .content-wrap {
                            padding: 10px !important;
                        }
                        .invoice {
                            width: 100% !important;
                        }
                    }
                </style>
            </head>
            
            <body style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #f6f6f6; margin: 0;"
                bgcolor="#f6f6f6">
            
                <table class="body-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6">
                    <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                        <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
                        <td class="container" width="600" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;"
                            valign="top">
                            <div class="content" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;">
                                <table class="main" width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; border: 1px solid #e9e9e9;"
                                    bgcolor="#fff">
                                    <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                        <td class="alert alert-warning" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 16px; vertical-align: top; color: #fff; font-weight: 500; text-align: center; border-radius: 3px 3px 0 0; background-color: #60b5d7; margin: 0; padding: 20px;"
                                            align="center" bgcolor="#FF9F00" valign="top">
                                            <img src="https://i.pinimg.com/originals/2a/a5/59/2aa5592fc6bb9259c371d5b70c7162a9.png" />
                                        </td>
                                    </tr>
                                    <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                        <td class="content-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;" valign="top">
                                            <table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                                <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                                    <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                                        Estás a <strong style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">1 paso</strong> de unirte a la mejor comunidad de préstamos.
                                                    </td>
                                                </tr>
                                                <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                                    <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                                        <a href="http://localhost:3000/confirm/${account.authToken}" class="btn-primary" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; color: #FFF; text-decoration: none; line-height: 2em; font-weight: bold; text-align: center; cursor: pointer; display: inline-block; border-radius: 5px; text-transform: capitalize; background-color: #348eda; margin: 0; border-color: #348eda; border-style: solid; border-width: 10px 20px;">Confirmar mi cuenta</a>
                                                    </td>
                                                </tr>
                                                <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                                    <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                                        Gracias por confiar en Elo :)
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                <div class="footer" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; clear: both; color: #999; margin: 0; padding: 20px;">
                                    <table width="100%" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                        <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                            <td class="aligncenter content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; vertical-align: top; color: #999; text-align: center; margin: 0; padding: 0 0 20px;" align="center" valign="top">
                                         <br />Copyright 2018 - ELO. Todos los derechos reservados.</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </td>
                        <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
                    </tr>
                </table>
            </body>
            
            </html>`

        };
        transporter.sendMail(message);
        return res.redirect('/verification');
        authenticate(req.body.email, req.body.password, function(err, result) {
            if (err) return res.send(err);
            return res.redirect('/');
        });
    });
});

//link de confirmación
router.get('/confirm/:authToken', (req, res) => {
    User.findOneAndUpdate({ authToken: req.params.authToken }, { $set: { isAuthenticated: "True" } })
        .then(() => {
            res.redirect("/");
        })
        .catch(e => console.log(e))
});

//pantalla verifica
router.get('/verification', (req, res) => {
    res.render('auth/verification');
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
    failureRedirect: '/login',
    //esto?
    failureFlash: true,
    passReqToCallback: true
}));

///////////////////////////LOG OUT/////////////////////////////////////
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});


/////////////////LOGIN CON FACEBOOK///////////////////
router.get("/auth/facebook", passport.authenticate("facebook"));
router.get("/auth/facebook/callback", passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/"
}));

///////////////////////////LOGIN CON GOOGLE/////////////////////////////////////
router.get("/auth/google", passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login",
        "https://www.googleapis.com/auth/plus.profile.emails.read"
    ]
}));

router.get("/auth/google/callback", passport.authenticate("google", {
    failureRedirect: "/",
    successRedirect: "/privada"
}));

router.get("/privada", (req, res) => {
    if (req.user) {
        return res.send("tienes permiso " + req.user.email);
    }
    res.send("no tienes permiso");
})

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