var express = require('express');
var router = express.Router();
const { index, actionSignIn, actionSignOut } = require('./controller');

router.get('/', index);
router.post('/', actionSignIn);
router.get('/logout', actionSignOut);

module.exports = router;
