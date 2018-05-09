const passport = require("passport");
const User = require("../models/User");
const LocalStrategy = require("passport-local").Strategy;

//google
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

//facebook
const FbStrategy = require('passport-facebook').Strategy;

passport.use(User.createStrategy());
//passport.serializeUser(User.serializeUser());
//passport.deserializeUser(User.deserializeUser());

passport.serializeUser((user, cb) => { cb(null, user._id); });

passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

//facebook
passport.use(new FbStrategy({
    clientID: "190815644881884",
    clientSecret: "265aa81e80ee471cc90ac53fa5ed9bc0",
    callbackURL: "/auth/facebook/callback"
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ facebookID: profile.id }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, user);
        }

        const newUser = new User({
            facebookID: profile.id
        });

        newUser.save((err) => {
            if (err) {
                return done(err);
            }
            done(null, newUser);
        });
    });

}));

//google
passport.use(new GoogleStrategy({
    clientID: "496679162300-vr71nl0qb8gnm6ljkb35pc5d2e9u7t6l.apps.googleusercontent.com",
    clientSecret: "mOdYhM3COXJpoa_gDJIwjPk_",
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleID: profile.id }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, user);
        }

        console.log(profile)

        const newUser = new User({
            googleID: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value
        });

        newUser.save((err) => {
            if (err) {
                return done(err);
            }
            done(null, newUser);
        });
    });

}));

module.exports = passport;