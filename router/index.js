const router = require('koa-router')();
const controller = require('../controller/index');


router.get('/', controller.index);
router.get('icons', controller.icons);


module.exports = router;
