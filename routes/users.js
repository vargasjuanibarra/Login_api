const express = require('express')
const router = express.Router()

// LOGIN PAGE
router.get('/login', (req, res) => {
    res.render('login')
})


// REGISTER PAGE
router.get('/register', (req, res) => {
    res.render('register')
})
router.post('/register', (req, res) => {
    const { name,email, password, password2 } = req.body
    let errors = []

    // CHECK REQUIRED FIELDS
    // if(!name || !email || !password || !password2) {
    //     errors.push({ msg: 'Please fill in all fields'})
    // }

    // CHECK IF PASSWORDS MATCH
    if ( password !== password2) {
        errors.push({ msg: 'Password do not match'})
    }


    // CHECK PASSWORD LENGTH
    if(password.length < 8) {
        errors.push({ msg: 'Password must be atleast 8 characters'})
    }

    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })

    } else {
        res.send('pass')
    }
})



module.exports = router