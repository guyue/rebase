const router = require('koa-router')();
const controller = require('../controller/index');


router.get('/', controller.index);


module.exports = router;
