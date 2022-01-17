const router = require('express').Router();
const { User } = require('../../models');
const jwt = require('jsonwebtoken');

// hard code user
let user = {
    id: '1',
    email: 'user@gmail.com',
    password: '1234567'
}

const JWT_SECRET = 'some super secret secret'

router.get('/', (req,res) => {
    User.findAll({
        attributes: {
            exclude: ['password']
        }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})


// GET forgot password route
router.get('/forgot-password', (req,res) => {
    // get user email 
    res.render('forgot-password')
    
})

router.post('/forgot-password', (req,res) => {
    const { email } = req.body;
    
    
    // make sure user exists in database
    if(email !== user.email){
        res.send(' User does not exist ');
        return;
    }
   
    // user exists, create one time link
    const secret = JWT_SECRET + user.password
    const payload = {
        email: user.email,
        id: user.id
    }
    const token = jwt.sign(payload, secret, {expiresIn: '15m'});
    const link = `http://localhost:3001/api/users/reset-password/${user.id}/${token}`
    console.log(link);
    res.send("Password reset link has been sent to your email")
    // send email to client with reset id
})

router.get('/reset-password/:id/:token', (req,res) => {
    const {id, token } = req.params
    
    // check if user exists in database
    if(id !== user.id){
        res.send('Invalid ID');
        return;
    }
    // valid id
    const secret = JWT_SECRET + user.password
    try {
        const payload = jwt.verify(token, secret)
        res.render('reset-password', {email: user.email})
    } catch(error) {
        console.log(error.message)
        res.send(error.message)
    }
})

router.post('/reset-password/:id/:token', (req,res) => {
    
    const { id, token } = req.params;
    const { password, password2} = req.body;
    if(id !== user.id) {
        res.send("Invalid user id")
        return;
    }

    const secret = JWT_SECRET + user.password
    try {
        const payload = jwt.verify(token, secret)
        // validate password and password2 should match
        
        // find user with the payload email and id / update with new password
        // always hash password before saving 
        user.password = password
        res.send(user)


    } catch(error){
        console.log(error.message)
        res.send(err.message)
    }
})

module.exports = router;