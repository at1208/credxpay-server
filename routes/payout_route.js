const express = require('express');
const router = express.Router();

const { create_payout } = require('../controllers/payout_controller');
// const { requireSignin, authMiddleware } = require('../controllers/auth');

// const { createBeneficiaryValidator } = require('../validators/beneficiary');
// const { runValidation }  = require('../validators/index');

router.post('/payout/create/:beneficiary_id', create_payout);


module.exports = router;
