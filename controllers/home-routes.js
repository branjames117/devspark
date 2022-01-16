const router = require('express').Router();
 



router.get('/login', (req,res) => {
    // if(req.session.loggedIn){
    //     res.redirect('/');
    //     return;
    // }{
    //     res.render('login');
    // }
    res.render('login');
});


module.exports = router;