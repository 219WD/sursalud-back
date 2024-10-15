const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const User = require('../model/User')

const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const bcrypt = require("bcrypt")

const JWT_SECRET = process.env.JWT_SECRET;

passport.use('signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {

        const newPass = await bcrypt.hash(password, 10)

        console.log()
        const user = await User.create({ email: email, password: newPass })
        return done(null, user)
    } catch (e) {
        done(e)
    }
}))

passport.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email })


        if (!user) {
            return done(null, false, { message: 'User not found' })
        }

        const validate = await isValidPassword(user, password)


        if (!validate) {
            return done(null, false, { message: 'Wrong password' })
        }

        return done(null, user, { message: 'Login successfull' })
    } catch (e) {
        return done(e)
    }
}))

passport.use(new JWTStrategy({
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
}, async (token, done) => {
    try {
        return done(null, token.user);
    } catch (e) {
        return done(e);
    }
}));


async function isValidPassword(user, password) {
    const compare = await bcrypt.compare(password, user.password)
    return compare
}
