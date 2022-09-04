var express = require('express');
var router = express.Router();
const multer = require('multer');
const os = require('os');

const { signUp, signIn } = require('./controller');

router.post('/sign-up', multer({ dest: os.tmpdir() }).single('image'), signUp);
router.post('/sign-in', signIn);

module.exports = router;
