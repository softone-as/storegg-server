var express = require('express');
const { isClientLoggedIn } = require('../middleware/auth');
var router = express.Router();
const multer = require('multer');
const os = require('os');

const {
    landingPage,
    detailPage,
    category,
    checkout,
    history,
    detailHistory,
    dashboard,
    profile,
    editProfile,
} = require('./controller');

router.get('/', landingPage);
router.get('/:id/detail', detailPage);
router.get('/category', category);
router.post('/checkout', isClientLoggedIn, checkout);
router.get('/history', isClientLoggedIn, history);
router.get('/history/:id/detail', isClientLoggedIn, detailHistory);
router.get('/dashboard', isClientLoggedIn, dashboard);
router.get('/profile', isClientLoggedIn, profile);
router.put(
    '/profile',
    isClientLoggedIn,
    multer({ dest: os.tmpdir() }).single('image'),
    editProfile
);

module.exports = router;
