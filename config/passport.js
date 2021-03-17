const LocalStrategy = require('passport-local')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


// LOAD MODEL
const user = require('../models/userSchemaModel')


module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // MATCH USER
            user.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'Email not registered' })
                    }

                    // MATCH PASSWORD
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Password incorrect' })
                        }

                    })
                })
                .catch(err => console.log(err))
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user.id);
    })
    passport.deserializeUser((id, done) => {
        user.findById(id, (err, user) => {
            done(err, user);
        })
    })
}