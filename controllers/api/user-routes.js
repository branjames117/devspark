const router = require('express').Router();
const { User } = require('../../models');
// const jwt = require('jsonwebtoken');
// const transporter = nodemailer.createTransport(transport[, defaults])

// nodemailer.createTransport({
//     host: "smtp.example.com",
//     port: 587,
//     secure: false, // upgrade later with STARTTLS
//     auth: {
//       user: "username",
//       pass: "password",
//     },
//   });

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


// POST create a user 
router.post('/', (req,res) => {
    // Expects { username, email, password }
    User.create({
        username: req.username,
        email: req.body.email,
        password: req.body.password,
        
    })
    .then(dbUserData => {
        req.session.save(() => {
            req.session.user_id = dbUserData.id,
            req.session.username = dbUserData.username,
            req.session.loggedIn = true;

            res.json(dbUserData);
            console.log(dbUserData);
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    });
});

// POST login route
router.post('/login', (req,res) => {
    // Expects email and password
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(dbUserData => {
        if(!dbUserData){
            res.status(400).json({ message: 'No User found with that email'});
            return;
        }

        // validate password
        const validPassword = dbUserData.checkPassword(req.body.password);
        if(!validPassword){
            res.status(400).json({ message: 'Incorrect Password' });
            return;
        }

        req.session.save(() => {
            // declare session variables
            req.session.user_id = dbUserData.id,
            req.session.username = dbUserData.username,
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: 'You are now logged in' });
        })
    });
});

// POST Logout route

router.post('/logout', (req,res) => {
    if(req.session.loggedIn){
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

// // PUT forgot password route
// router.put('/forgot-password', (req,res) => {
//     // get user email 
//     const email = req.body.email;

//     User.findOne({email}, (err, user) => {
//         if(err || !user){
//             res.status(404).json({ message: 'No user exists with that email' });
//             return;
//         }

//         const token = jwt.sign({_id: user.id}, process.env.RESET_PASSWORD_KEY, {expiresIn: '10m'});
//         const data = {

//             from: 'noreply@hello.com',
//             to: email,
//             subject: 'Account Password Reset Link',
//             html:`
//                 <h2>Please click on the given link to reset your account password</h2>
//                 <p>${user.id}/password-reset${token}</p>
//             `
//         };

//         return user.updateOne({resetLink: token}, (err, success) {
//             if(err){
//                 return res.status(400).json({ error: 'Reset password link error' });
//             } else {

//             }
//         })
//     })
    
// })

module.exports = router;