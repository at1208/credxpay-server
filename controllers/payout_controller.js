const request = require('request');
const Transaction = require('../models/transaction_model');
const Setting = require('../models/admin_setting_model');

module.exports.create_payout = (req, res) => {
   const { beneficiary_id } = req.params;
   Transaction.find({ beneficiary: beneficiary_id })
    .populate('beneficiary', 'beneficiary_name ifsc_code beneficiary_account amount purpose')
    .exec((err, resp) => {
      if(err){
        return res.status(400).json({
          error: err
        })
      }
  // Creating Contact of beneficiary
      var options = {
        'method': 'POST',
        'url': 'https://api.razorpay.com/v1/contacts',
        'headers': {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${process.env.RAZORPAY_PAYOUT_AUTH}`
        },
        body: JSON.stringify({ "name":resp[0].beneficiary.beneficiary_name,
                               "type":"customer",
                               "reference_id":`${beneficiary_id}`})
      };

      request(options, function (error, response) {
        if (error) {
           return res.status(400).json({
             error: error
           })
        }
      console.log('contact', JSON.parse(response.body).id)
   Transaction.findOneAndUpdate({ beneficiary: beneficiary_id }, { razorpay_contact_id: JSON.parse(response.body).id}, { new: true })
   .exec((err, response2) => {
     if(err){
       return res.status(400).json({
         error: err
       })
     }

     // Creating fund account of the beneficiary
        var options = {
          'method': 'POST',
          'url': 'https://api.razorpay.com/v1/fund_accounts',
          'headers': {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${process.env.RAZORPAY_PAYOUT_AUTH}`
          },
          body: JSON.stringify({ "contact_id":JSON.parse(response.body).id,
                                 "account_type":"bank_account",
                                 "bank_account":{"name": resp[0].beneficiary.beneficiary_name,
                                                 "ifsc":resp[0].beneficiary.ifsc_code,
                                                 "account_number":resp[0].beneficiary.beneficiary_account }})

        };

        request(options, function (error, result) {
          if (error) {
             return res.status(400).json({
               error: error
             })
          }
          console.log('fund',JSON.parse(result.body).id)
         Transaction.findOneAndUpdate({beneficiary: beneficiary_id}, {razorpay_fund_id: JSON.parse(result.body).id},{ new: true })
           .exec((err, response3) => {
             if(err){
               return res.status(400).json({
                 error: err
               })
             }
             // Payout
             Setting.find()
             .exec((err, response5) => {
               if(err){
                 return res.status(400).json({
                   error: err
                 })
               }
                 var options = {
                   'method': 'POST',
                   'url': 'https://api.razorpay.com/v1/payouts',
                   'headers': {
                     'Content-Type': 'application/json',
                     'Authorization': `Basic ${process.env.RAZORPAY_PAYOUT_AUTH}`
                   },
                   body: JSON.stringify({"account_number": process.env.RAZORPAYX_ACCOUNT_NO,"fund_account_id": JSON.parse(result.body).id,"amount":resp[0].beneficiary.amount*100,"currency":"INR","mode":"NEFT","purpose":"payout","queue_if_low_balance":true})
                 };

                 request(options, function (error, data) {
                   if (error) {
                      return res.status(400).json({
                        error: error
                      })
                   }
                   console.log('payout', JSON.parse(data.body))

                   // Payout error
                   if(JSON.parse(data.body).error){
                      return  Transaction.findOneAndUpdate({beneficiary: beneficiary_id},{status: "payout failed", payout_error: JSON.parse(data.body).error.description},{ new: true })
                       .exec((err, response4) => {
                           if(err){
                             return res.status(400).json({
                               error: err
                             })
                           }
                           res.status(200).json({
                             message: "Payout Failed"
                           })
                         })
                   }
                     Transaction.findOneAndUpdate({beneficiary: beneficiary_id},{razorpay_payout_id: JSON.parse(result.body).id,status: "payout successful", payout_mode: JSON.parse(data.body).mode},{ new: true })
                     .exec((err, response4) => {
                         if(err){
                           return res.status(400).json({
                             error: err
                           })
                         }
                         res.status(200).json({
                           message: "Payout successful"
                         })
                       })
                    });
                  })
               })
            });
         })
      });
    })
}
