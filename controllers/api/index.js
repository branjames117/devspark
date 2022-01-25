const router = require('express').Router();

const userRoutes = require('./user-routes');
const imageRoutes = require('./image-routes');
const skillRoutes = require('./skill-routes');

router.use('/users', userRoutes);
router.use('/images', imageRoutes);
router.use('/skills', skillRoutes);

module.exports = router;
