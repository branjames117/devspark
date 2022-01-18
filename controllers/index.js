const routes = require('express').Router();

const apiRoutes = require('./api');

routes.use('/api', apiRoutes);

// routes.use((req, res) =>{
//     console.log('hello');
//     res.status(404).end();
// });

module.exports = routes;