const router = require('express').Router();
const { User } = require('../../models');



// POST create a user 
router.post('/', (req,res) => {
    // Expects { username, email, password, bio, images, bday, techskills, github profile }
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

// Logout route

router.post('/logout', (req,res) => {
    if(req.session.loggedIn){
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
})