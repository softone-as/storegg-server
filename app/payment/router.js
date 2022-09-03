var express = require('express');
var router = express.Router();
const {
    index,
    viewCreate,
    actionCreate,
    actionUpdate,
    actionDelete,
    viewEdit,
    actionStatus,
} = require('./controller');
const { isAdminLoggedIn } = require('../middleware/auth');

router.use(isAdminLoggedIn);
router.get('/', index);
router.get('/create', viewCreate);
router.post('/create', actionCreate);
router.get('/edit/:id', viewEdit);
router.put('/edit/:id', actionUpdate);
router.delete('/delete/:id', actionDelete);
router.put('/status/:id', actionStatus);

module.exports = router;
