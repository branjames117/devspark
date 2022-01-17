const router = require('express').Router();

const imageRoutes = require('./image-routes');

router.use('/image', imageRoutes);

module.exports = router;