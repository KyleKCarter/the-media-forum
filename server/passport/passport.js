require('dotenv').config()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuthStrategy

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALL_BACK_URI } = process.env;

passport.use(new GoogleStrategy({
    consumerKey: GOOGLE_CLIENT_ID,
    consumerSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALL_BACK_URI
},
    function (token, tokenSecret, profile, done) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return done(err, user)
        });
    }
));

app.get('/auth/google/',
    passport.authenticate('google', { scope: 'https://www.google.com/m8/feeds' })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    }
);