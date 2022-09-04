var express = require('express');
const { isClientLoggedIn } = require('../middleware/auth');
var router = express.Router();
const { landingPage, detailPage, category, checkout } = require('./controller');

router.get('/', landingPage);
router.get('/:id/detail', detailPage);
router.get('/category', category);
router.post('/checkout',isClientLoggedIn, checkout);

module.exports = router;
