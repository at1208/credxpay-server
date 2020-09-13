const mongoose =  require('mongoose');

const adminSettingSchema  = mongoose.Schema({
      processing_charge: {
        type: Number
      },
      payout_mode: {
        type: String,
        enum: ['IMPS','RTGS','NEFT','UPI']
      },

},{ timestamps: true })
module.exports = mongoose.model('AdminSetting', adminSettingSchema);
