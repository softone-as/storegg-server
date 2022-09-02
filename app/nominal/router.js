var express = require('express');
var router = express.Router();
const {
    index,
    viewCreate,
    actionCreate,
    actionUpdate,
    actionDelete,
    viewEdit,
} = require('./controller');

router.get('/', index);
router.get('/create', viewCreate);
router.post('/create', actionCreate);
router.get('/edit/:id', viewEdit);
router.put('/edit/:id', actionUpdate);
router.delete('/delete/:id', actionDelete);

module.exports = router;
