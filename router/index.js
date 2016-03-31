const router = require('koa-router')();
const controller = require('../controller/index');


router.get('/', controller.index);
router.get('svgs', controller.svgs);
router.get('icons', controller.icons);
router.get('buttons', controller.buttons);


module.exports = router;
