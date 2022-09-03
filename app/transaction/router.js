var express = require('express');
var router = express.Router();
const { index, actionStatus } = require('./controller');
const { isAdminLoggedIn } = require('../middleware/auth');

router.use(isAdminLoggedIn);
router.get('/', index);
router.put('/status/:id', actionStatus);

module.exports = router;
