const router = require('express').Router();

const htmlRoutes = require('./html-routes');
const chatRoutes = require('./chat-routes');
const apiRoutes = require('./api');

router.use('/', htmlRoutes);
router.use('/chat', chatRoutes);
router.use('/api', apiRoutes);

router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;
