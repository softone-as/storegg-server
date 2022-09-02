var express = require('express');
var router = express.Router();
const multer = require('multer');
const os = require('os');

const {
    index,
    viewCreate,
    actionCreate,
    actionUpdate,
    actionDelete,
    viewEdit,
    actionStatus,
} = require('./controller');

router.get('/', index);
router.get('/create', viewCreate);
router.post(
    '/create',
    multer({ dest: os.tmpdir() }).single('image'),
    actionCreate
);
router.get('/edit/:id', viewEdit);
router.put(
    '/edit/:id',
    multer({ dest: os.tmpdir() }).single('image'),
    actionUpdate
);
router.delete('/delete/:id', actionDelete);
router.put('/status/:id', actionStatus);

module.exports = router;
