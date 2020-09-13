const express = require('express');
const router = express.Router();

const { change_setting } = require('../controllers/admin_setting_controller');
// const { requireSignin, authMiddleware } = require('../controllers/auth');

// const { createBeneficiaryValidator } = require('../validators/beneficiary');
// const { runValidation }  = require('../validators/index');

router.patch('/setting/admin/', change_setting);


module.exports = router;
