const express = require('express');
const router = express.Router();

const { get_users } = require('../controllers/user_controller');
// const { requireSignin, authMiddleware } = require('../controllers/auth');

// const { createBeneficiaryValidator } = require('../validators/beneficiary');
// const { runValidation }  = require('../validators/index');

router.get('/user/:filter', get_users);


module.exports = router;
