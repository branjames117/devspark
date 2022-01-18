const routes = require('express').Router();

const imageRoutes = require('./image-routes');

routes.use('/image', imageRoutes);

module.exports = routes;