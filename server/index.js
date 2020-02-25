require('dotenv').config()
const express = require('express')
const session = require('express-session')
const massive = require('massive')

//imports for google oauth
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//controllers

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


//google passport

//env information
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALL_BACK_URI } = process.env;

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//passport serialization
passport.serializeUser((id, done) => done(null, id))

passport.deserializeUser((obj, done) => done(null, obj))

//log into google account
let googleUser = null
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALL_BACK_URI
},
    (accessToken, refreshToken, profile, done) => {
        // user.findOrCreate({ googleId: profile.id }, function (err, user) {
        //     return done(err, user)
        // });
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
        const user = await db.user.addUser([displayName, givenName, familyName, value])
        console.log("user:", user)
        const {user_id, displayname} = user[0]
        req.session.user = {
            id: user_id,
            name: displayname
        }
        console.log(req.session)
        // console.log(req.session.user)
        res.redirect('http://localhost:3000/#/')
    }
);

//http request for passport for login
app.get('/auth/google/login',
    passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect: 'http://localhost:3000/#/login'}),
    //getting user from database
    getGoogleUser = async(req, res) => {
        const {displayName} = googleUser
        const db = req.app.get('db')
        const user = await db.user.getUser(displayName)
        console.log(user)
        res.redirect('http://localhost:3000/#/')
    }    
);

//ENDPOINTS

app.listen(SERVER_PORT, () => console.log(`Server running on port ${SERVER_PORT}`))