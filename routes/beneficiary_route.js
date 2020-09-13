const express = require('express');
const router = express.Router();

const { create_beneficiary } = require('../controllers/beneficiary_controller');
// const { requireSignin, authMiddleware } = require('../controllers/auth');

const { createBeneficiaryValidator } = require('../validators/beneficiary');
const { runValidation }  = require('../validators/index');

router.post('/beneficiary/create', createBeneficiaryValidator, runValidation, create_beneficiary);


module.exports = router;
