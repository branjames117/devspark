const router = require('express').Router();

const userRoutes = require('./user-routes');
const imageRoutes = require('./image-routes');

router.use('/users', userRoutes);
router.use('/images', imageRoutes);

module.exports = router;
