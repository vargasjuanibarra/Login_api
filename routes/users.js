const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const user = require('../models/userSchemaModel')

// LOGIN PAGE
router.get('/login', (req, res) => {
    res.render('login')
})


// REGISTER PAGE
router.get('/register', (req, res) => {
    res.render('register')
})
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body
    let errors = []

    // CHECK REQUIRED FIELDS
    // if(!name || !email || !password || !password2) {
    //     errors.push({ msg: 'Please fill in all fields'})
    // }

    // CHECK IF PASSWORDS MATCH
    if (password !== password2) {
        errors.push({ msg: 'Password do not match' })
    }


    // CHECK PASSWORD LENGTH
    if (password.length < 8) {
        errors.push({ msg: 'Password must be atleast 8 characters' })
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })

    } else {
        user.findOne({ email: email })
            .then(User => {
                if (User) {
                    // USER EXISTS
                    errors.push({ msg: 'Email already exists' })
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                } else {
                    const newUser = new user({
                        name,
                        email,
                        password
                    });

                    // HASH PASSWORD
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) console.log(err)
                            
                            // SET PASSWORD TO HASHED
                            newUser.password = hash;
                            // SAVE USER
                            newUser.save()
                                .then(User => {
                                    res.redirect('/users/login')
                                })
                                .catch(err => console.log(err));
                        
                    }))

                }
            })
    }
})



module.exports = router