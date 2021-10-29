const express = require ('express');
const router = express.Router();

router.use('/admin', require('./admin'));
router.use('/mainreseller', require('./mainreseller'));
router.use('/reseller', require('./reseller'));
router.use('/user', require('./user'));

module.exports = router;