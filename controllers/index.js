const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./home-routes');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);


// if you make a request to any endpoint that dosen't exist you'll receive a 404 error status
router.use((req,res) => {
    res.status(404).end();
});

module.exports = router;