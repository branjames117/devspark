const router = require('express').Router();
const withAuth = require('../../utils/auth');
const { randomBytes } = require('crypto');
const { User, Message } = require('../../models');
const async = require('async')
const waterfall = require('async/waterfall');
const nodemailer = require('nodemailer')
require('dotenv').config()
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2;




// GET /api/users

router.get('/', (req, res) => {
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
router.get('/forgot', (req, res) => {
    // get user email 
    res.render('forgot-password')

})

async function tokenizeUser(userId) {
    const token = randomBytes(20).toString('hex')
    const updatedUser = await User.update({
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 3600000
    }, {
        where: { id: userId }
    })

    return await User.findOne({ id: updatedUser.id })
}

const createTransporter = async () => {
    const oauth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
    });

    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
            if (err) {
                reject();
            }
            resolve(token);
        });
    });

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: 'devspark003@gmail.com',
            accessToken,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN
        }
    });

    return transporter;
};
router.post('/forgot', async function (req, res) {
    console.log(req.body.email, 'Email captured');

    const userDb = await User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
            req.flash('error', 'No account found with that email address');
            return res.redirect('/forgot');
        }
    });

    if (userDb) {
        let user = await tokenizeUser(userDb.id)

        var mailOptions = {
            to: req.body.email,
            from: 'devspark003@gmail.com',
            subject: 'DevSpark Password Reset',
            text: 'For clients with plaintext support only',
            html: `
            <p>You are receiving this link because you have requested the reset of your password for your account ${user.email}.
            'Please click on the following link, or paste this into your browser to complete this process:</p>
            <a href="http://localhost:3001/api/users/reset/${user.resetPasswordToken}">Reset link</a>
            <p>If you did not request a password reset. Please ignore this email.</p>`
        };

        const sendEmail = async (emailOptions) => {
            let emailTransporter = await createTransporter()
            await emailTransporter.sendMail(emailOptions)
        }

        sendEmail(mailOptions).then(() => console.log('sent email'))
        res.status(200).json({ status: 'success', message: 'message sent' })
    }

});

router.get('/reset/:token', function (req, res) {
    console.log('========')
    console.log(req.params.token);
    User.findOne({ where: { resetPasswordToken: req.params.token } }).then(function (user) {
        if (!user) {

            res.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/api/users/forgot');
        }

        res.render('reset', { token: req.params.token });
    });
});

router.post('/reset/:token', (req, res) => {
    console.log('You made it here');
    if (req.body.password !== req.body.confirm) {
        console.log('Passwords do not match')
        // res.flash('error', 'Password reset token is invalid or has expired');
        return res.redirect('back')

    } else {
        console.log(req.body.password, req.body.confirm)
        User.update({
            resetPasswordToken: undefined,
            resetPasswordExp: undefined,
            password: req.body.password
          }, {
            where: { resetPasswordToken: req.params.token },
            returning: true,
            plain: true
          })
          .then(result => console.log(result)).catch(err => console.log(err));

        // var mailOptions = {
        //     to: user.email,
        //     from: 'devspark003@gmail.com',
        //     subject: 'Your password has been changed',
        //     html: 'This email is confirming your account at' + user.email + 'password has been changed.\n'

        // };
        // const sendConfirmEmail = async (emailOptions) => {
        //     let emailTransporter = await createTransporter()
        //     await emailTransporter.sendConfirmMail(emailOptions)
        // }
        // sendConfirmEmail(mailOptions).then(() => console.log('sent email'))
        // res.status(200).json({status: 'success', message: 'message sent'})

    }

});

// GET /api/users/1
router.get('/:id', (req, res) => {
    const id = req.params.id;

    // get user by id
    User.findOne({
        attributes: { exclude: ['password'] },
        where: { id },
        include: [
            // include user's posts,
            {
                model: Message,
                attributes: ['id', 'body', 'sender_id', 'recipient_id', 'created_at'],
            },
        ],
    })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST /api/users
router.post('/', (req, res) => {
    // create new user
    // req.body must be object with username and password
    User.create(req.body)
        .then((dbUserData) => {
            // save new user's session
            req.session.save(() => {
                req.session.user_id = dbUserData.id;
                req.session.email = dbUserData.email;
                req.session.loggedIn = true;

                res.json(dbUserData);
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST /api/users/login
router.post('/login', (req, res) => {
    // find user based on username
    User.findOne({
        where: {
            email: req.body.email,
        },
    }).then((dbUserData) => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email!' });
            return;
        }

        // check if password is valid with checkPassword class method
        const validPassword = dbUserData.checkPassword(req.body.password);

        // if password invalid, err
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }

        // if password valid, save new session data
        req.session.save(() => {
            // declare session variables
            req.session.user_id = dbUserData.id;
            req.session.email = dbUserData.email;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: 'You are now logged in!' });
        });
    });
});

// POST /api/users/logout
router.post('/logout', withAuth, (req, res) => {
    // destroy session if logged in
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

// PUT /api/users/1
router.put('/:id', withAuth, (req, res) => {
    const id = req.params.id;

    // update user data
    User.update(req.body, {
        individualHooks: true,
        where: {
            id,
        },
    })
        .then((dbUserData) => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// DELETE /api/users/1
router.delete('/:id', withAuth, (req, res) => {
    const id = req.params.id;
    const sessionId = res.session.user_id;

    // check if id in param matches session id so auth'd users can't just delete whomever they want
    const validDelete = id == sessionId;

    if (validDelete) {
        User.destroy({
            where: {
                id,
            },
        })
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    } else {
        res
            .status(403)
            .json({ message: 'You do not have authorization to delete this user' });
    }
});

module.exports = router;
