const express = require('express');
const router = express.Router();

const { create_payment,
        verifyPayment,
        getPaymentsById,
        getPaymentsByUserId,
        getBeneficiaryId,
        getAllPayments } = require('../controllers/payment_controller');

// const { requireSignin, authMiddleware } = require('../controllers/auth');
// const { createBeneficiaryValidator } = require('../validators/beneficiary');
// const { runValidation }  = require('../validators/index');

router.post('/payment/create', create_payment);
router.post('/payment/verify', verifyPayment);
router.get('/payments/admin', getAllPayments);
router.get('/payment/details/:payerID', getPaymentsById);
router.get('/payment/details/admin/:userID', getPaymentsByUserId);
router.get('/payment/beneficiary/:razorpay_payment_id', getBeneficiaryId);
module.exports = router;
