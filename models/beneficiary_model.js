const mongoose =  require('mongoose');
const { ObjectId } = mongoose.Schema;


const beneficiarySchema  = mongoose.Schema({
      beneficiary_name: {
      type: String,
      required: true
      },
      beneficiary_account: {
      type: Number,
      required: true,
      },
      ifsc_code: {
      type: String,
      required: true,
      },
      amount: {
      type: Number,
      required: true
      },
      purpose: {
      type: String
      },
      payer: {
      type: ObjectId,
      required: true,
      ref: 'User'
      },
},{ timestamps: true })

module.exports = mongoose.model('Beneficiary', beneficiarySchema);
