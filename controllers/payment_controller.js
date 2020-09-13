const Beneficiary = require('../models/beneficiary_model');
const Payment = require('../models/payment_model');
const Razorpay = require('razorpay');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { errorHandler } = require('../helpers/dbErrorHandler');

//Create an instace of razorpay
var razorpay = new Razorpay({
 key_id: process.env.RAZORPAY_KEY_ID,
 key_secret: process.env.RAZORPAY_KEY_SECRET
});


// CREATE PAYMENT
module.exports.create_payment = (req,res) => {
  //take beneficiary details
   const {beneficiary_id} = req.body;

   Beneficiary.findById(beneficiary_id).exec((err, response) => {
     if(err){
       return res.status(400).json({
         error: err
       })
     }
    if(!response){
      return res.status(404).json({
        error: "Beneficiary not found"
      })
    }

    const options = {
    amount: response.amount*100,
    currency: "INR",
    receipt: uuidv4(),
    payment_capture: '1'
    };

// initiate razorpay order
   razorpay.orders.create(options, async (err, order) => {
     if(err){
       return res.status(400).json({
         error: err
       })
     }
     // after successfull razorpay order created save payment details into the database
      const newPayment = Payment({ payer: response.payer,
                                   beneficiary: beneficiary_id,
                                   razorpay_order_id: order.id,
                                   status: 'UNVERIFIED_IN_PROCESS' })

      await newPayment.save((err, response) => {
         if(err){
           return res.status(400).json({
             error: errorHandler(err)
           })
         }
          return res.status(200).json({
           orderID: order.id,
           message: 'payment created successfuly'
            })
        })
     })
   })
}


// VERIFY PAYMENT
module.exports.verifyPayment = (req, res) => {
  const {razorpay_payment_id, razorpay_order_id, razorpay_signature} = req.body;

  // generate signature with razorpay_payment_id and razorpay_order_id
  let generatedSignature = crypto
                         .createHmac("SHA256",process.env.RAZORPAY_KEY_SECRET)
                         .update(razorpay_order_id + "|" + razorpay_payment_id)
                         .digest("hex");
  // match the razorpay signature with generated signature
  let isSignatureValid = generatedSignature == razorpay_signature;

if(isSignatureValid){
  //if generatedSignature matched with the given razorpay_signature then update the payment status to Verified
  const update_info = {razorpay_payment_id:  razorpay_payment_id, status: 'VERIFIED_IN_PROCESS'}
  return  Payment.findOneAndUpdate({ razorpay_order_id: razorpay_order_id },update_info,{ new: true })
        .exec((err, result) => {
          if(err || !result){
            return res.status(400).json({
              error: errorHandler(err)
            })
          }
        return res.status(200).json({
          message: 'Payment verified successfuly'
        })
        })
  }
return res.status(400).json({
  message: 'Payment verification failed'
  })
}


module.exports.getPaymentsById = (req, res) => {
  const { payerID } = req.params;
  Payment.find({ payer: payerID })
      .sort({ createdAt: -1 })
      .populate('payer', 'name email phone')
      .populate('beneficiary', 'beneficiary_name beneficiary_account ifsc_code amount purpose')
      .select('_id status createdAt')
      .exec((err, result) => {
        if(err){
          return res.status(400).json({
            error: err
          })
        }
        return res.status(200).json({
          result
        })
      })
}


module.exports.getPaymentsByUserId = (req, res) => {
  const { userID } = req.params;
  Payment.find({ payer: userID })
      .sort({ createdAt: -1 })
      .populate('payer', 'name email phone verified role')
      .populate('beneficiary', 'beneficiary_name beneficiary_account ifsc_code amount purpose')
      .select('_id status createdAt razorpay_fund_id razorpay_order_id razorpay_payout_id razorpay_contact_id razorpay_payment_id')
      .exec((err, result) => {
        if(err){
          return res.status(400).json({
            error: err
          })
        }
        return res.status(200).json({
          result
        })
      })
}


module.exports.getAllPayments = (req, res) => {
  Payment.find()
      .sort({ createdAt: -1 })
      .populate('payer', 'name email phone verified role')
      .populate('beneficiary', 'beneficiary_name beneficiary_account ifsc_code amount purpose')
      .select('_id status createdAt razorpay_fund_id razorpay_order_id razorpay_payout_id razorpay_contact_id razorpay_payment_id')
      .exec((err, result) => {
        if(err){
          return res.status(400).json({
            error: err
          })
        }
        return res.status(200).json({
          result
        })
      })
}


module.exports.getBeneficiaryId = (req, res) => {
     const { razorpay_payment_id } = req.params;

     Payment.findOne({ razorpay_payment_id })
      .select('beneficiary')
       .exec((err, result) => {
         if(err){
           return res.status(400).json({
             error: err
           })
         }
         res.status(200).json({
           result
         })
       })
}
