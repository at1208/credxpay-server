const { check } = require('express-validator');

exports.createBeneficiaryValidator = [
      check('beneficiary_name')
      .not()
      .isEmpty()
      .withMessage('Beneficiary name is required'),

      check('beneficiary_account')
      .not()
      .isEmpty()
      .withMessage('Beneficiary account number  is required'),

      check('ifsc_code')
      .not()
      .isEmpty()
      .withMessage('IFSC code is required'),

      check('amount')
      .not()
      .isEmpty()
      .withMessage('Amount is required'),

      check('payer')
      .not()
      .isEmpty()
      .withMessage('Payer id is required'),

];
