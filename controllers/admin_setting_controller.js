const Setting =  require('../models/admin_setting_model');

module.exports.change_setting = (req, res) => {
    const { processing_charge, payout_mode} = req.body;
    Setting.find()
    .exec((err, result) => {
      if(err){
        return res.status(400).json({
          error: err
        })
      }
    if(result.length==0){
          const newSetting = Setting({
          processing_charge,
          payout_mode
          })

        return newSetting.save((err, response) => {
          if(err){
            return res.status(400).json({
              error: err
            })
          }
          return res.status(200).json({
            message: "Settings creaded successfuly"
          })
        })
      }
    Setting.findByIdAndUpdate(result[0]._id, { processing_charge, payout_mode }, { new: true })
    .exec((err, data) => {
      if(err){
        return res.status(400).json({
          error: err
        })
      }
      return res.status(200).json({
        result: "Setting changed successfuly"
      })
    })
  })
}
