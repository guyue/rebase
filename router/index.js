const router = require('koa-router')();
const controller = require('../controller/index');


router.get('/', controller.index);
router.get('svgs', controller.svgs);
router.get('icons', controller.icons);
router.get('badges', controller.badges);
router.get('buttons', controller.buttons);
router.get('forms', controller.forms);


module.exports = router;
