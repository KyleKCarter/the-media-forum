require('dotenv').config()
const express = require('express')
const session = require('express-session')
const massive = require('massive')

//imports for google oauth
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//controllers
const {logout} = require('./controllers/authentication/authController')

const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env

const app = express()

//massive
massive(CONNECTION_STRING)
    .then(db => {
        app.set('db', db);
        console.log("Database Connected")
    })

//session
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    })
)

app.use(express.json())


//GOOGLE PASSPORT

//env information
const { GOOGLE_CLIENT_ID_1, GOOGLE_CLIENT_SECRET_1, GOOGLE_CALL_BACK_URI_1} = process.env;

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//passport serialization
passport.serializeUser((id, done) => done(null, id))
passport.deserializeUser((obj, done) => done(null, obj))

//log into google account
let googleUser = null
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID_1,
    clientSecret: GOOGLE_CLIENT_SECRET_1,
    callbackURL: GOOGLE_CALL_BACK_URI_1
},
    (accessToken, refreshToken, profile, done) => {
        googleUser = profile
        done(null, profile)
    }
));

//http request for passport for register
app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:3000/#/register' }),
    //saving information from google to db
    addGoogleUser = async (req, res) => {
        const { displayName } = googleUser
        const { givenName, familyName } = googleUser.name
        const { value } = googleUser.photos[0]
        const db = req.app.get('db')
        const checkedUser = await db.user.getUser([displayName])
            if(checkedUser.length === 0) {
                const user = await db.user.addUser([displayName, givenName, familyName, value])
                const {user_id, displayname} = user[0]
                req.session.user = {
                    id: user_id,
                    name: displayname
                }
            } else {
                req.session.user = {
                    id: checkedUser[0].user_id,
                    name: checkedUser[0].displayname
                }
            }
        console.log('user: ', req.session.user)
        res.redirect('http://localhost:3000/#/')
    }
);

//ENDPOINTS

    //AUTHENTICATION
    app.get('/auth/logout', logout)

app.listen(SERVER_PORT, () => console.log(`Server running on port ${SERVER_PORT}`))