const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const transactionSchema = mongoose.Schema({
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
  payout_error: {
    type: String,
    default: null
  },
  payout_mode: {
    type: String,
    default: null
  },
  status: {
    type: 'String',
    enum:['payment failed','payment unverified', 'payment verified', 'payout failed', 'payout successful'],
    default: 'payment failed'
  }
},{ timestamps: true }
)

module.exports = mongoose.model('Transaction', transactionSchema)
