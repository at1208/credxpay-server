const Beneficiary = require('../models/beneficiary_model');


module.exports.create_beneficiary = (req,res) => {
 const { beneficiary_name,
         beneficiary_account,
         ifsc_code,
         amount,
         payer,
         purpose } = req.body;

 const newBeneficiary = Beneficiary({
       beneficiary_name,
       beneficiary_account,
       ifsc_code,
       amount,
       payer,
       purpose
 })

 newBeneficiary.save((err, response) => {
    if(err){
      return res.status(400).json({
        error: errorHandler(err)
      })
    }
    res.status(200).json({
      result: response
    })
 })
}

module.exports.get_beneficiary_id = (req, res) => {
  
}
