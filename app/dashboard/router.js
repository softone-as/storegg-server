var express = require('express');
var router = express.Router();
const { index } = require('./controller');
const { isAdminLoggedIn } = require('../middleware/auth');

router.use(isAdminLoggedIn);
router.get('/', index);

module.exports = router;
