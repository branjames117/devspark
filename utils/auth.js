null;

const withAuth = (req, res, next) => {
    if(!req.session.loggedIn){
        res.redirect('/login');
        res.json({ message: 'You must login first' });
    } else {
        next();
    }
}