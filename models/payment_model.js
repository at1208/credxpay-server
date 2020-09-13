const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const paymentSchema = mongoose.Schema({
  payer: {
    type: ObjectId,
    ref: 'User'
  },
  beneficiary: {
    type: ObjectId,
    ref: 'Beneficiary'
  },
  razorpay_order_id: {
    type: String,
    default: null
  },
  razorpay_payment_id: {
    type: String,
    default: null
  },
  razorpay_contact_id: {
    type: String,
    default: null
  },
  razorpay_fund_id: {
    type: String,
    default: null
  },
  razorpay_payout_id: {
    type: String,
    default: null
  },
  status: {
    type: 'String',
    enum:['FAIL','UNVERIFIED_IN_PROCESS', 'VERIFIED_IN_PROCESS', 'SUCCESS'],
    default: 'FAIL'
  }
},{ timestamps: true }
)

module.exports = mongoose.model('Payment', paymentSchema)
