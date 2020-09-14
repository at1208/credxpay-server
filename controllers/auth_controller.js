const axios = require('axios');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const User = require('../models/auth_model');
const { errorHandler } = require('../helpers/dbErrorHandler');

module.exports.send_otp = (req, res) => {
  const { phone } =  req.body;

  if(!phone){
    return res.status(400).json({
      error: "Phone number is required"
    })
  }

  if(!(parseInt(phone.toString().length) === 10)){
    return res.status(400).json({
      error: "Phone number is not valid"
    })
  }

  axios(`${process.env.TWOFACTOR_BASE_URL}/${process.env.TWOFACTOR_API_KEY}/SMS/${phone}/AUTOGEN`)
    .then(response => {
      User.findOne({ phone })
      .exec((err, result) => {
        if(err){
          return res.status(400).json({
            error: err
          })
        }
        if(!result){
          const newUser = User({ phone })
          return newUser.save((err, data) => {
            if(err){
              return res.status(400).json({
                error: err
              })
            }
            return res.status(200).json({
               message: `OTP has been sent to ${phone}`,
               session_id: response.data.Details
            })
          })
        }
        return res.status(200).json({
           message: `OTP has been sent to ${phone}`,
           session_id: response.data.Details
        })
      })
  })
    .catch(err => {
      return res.status(400).json({
      error: 'Phone number is incorrect'
      })
  })
}



module.exports.verify_otp = async (req, res) => {
  const { session_id, otp ,phone, key } =  req.body;

  if(!otp){
    return res.status(400).json({
      error: "OTP is required"
    })
  }

  if(!session_id){
    return res.status(400).json({
      error: "Session id is required"
    })
  }

  if(!phone){
    return res.status(400).json({
      error: "Phone number is required"
    })
  }

  if(!(parseInt(phone.toString().length) === 10)){
    return res.status(400).json({
      error: "Phone number is not valid"
    })
  }

  // if(!key || !(key === process.env.OTP_SECRET)){
  //   return res.status(400).json({
  //     error: "Key is required"
  //   })
  // }

  axios(`${process.env.TWOFACTOR_BASE_URL}/${process.env.TWOFACTOR_API_KEY}/SMS/VERIFY/${session_id}/${otp}`)
    .then(response => {

  if(response.data.Details === "OTP Expired"){
    return res.status(400).json({
          error: "OTP is expired"
        })
  }

  User.findOne({ phone })
    .exec((err, result) => {
      if(err){
        return res.status(400).json({
          error: err
        })
      }
      if(!result){
        const newUser = User({ phone, verified: true })
        return newUser.save((err, data) => {
          if(err){
            return res.status(400).json({
              error: err
            })
          }

          const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
          res.cookie('token', token, { expiresIn: '1d' });
          const user = { _id: data._id, verified: data.verified, phone: data.phone}
          return res.status(200).json({
             message: "Verified successfuly",
             token: token,
             user: user,
          })
        })
      }
      User.findByIdAndUpdate(result._id, { verified: true }, (err, data) => {
        if(err){
          return res.status(400).json({
            error: err
          })
        }

        const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { expiresIn: '1d' });
        const user = { _id: data._id, verified: data.verified, phone: data.phone, name: data.name, email: data.email}
        return res.status(200).json({
             message: "Verified successfuly",
             token: token,
             user: user,
          })
        })
      })
     }
  )
    .catch(err => {
      return res.status(400).json({
        error: "OTP is incorrect"
      })
   })
}


exports.saveUserDetails = (req, res) => {
  const { name, email, _id } = req.body;
    User.findByIdAndUpdate(_id, {name, email}, { new: true})
      .exec((err, result) => {
        if(err){
          return res.status(400).json({
            error: err
          })
        }
        res.status(200).json({
          message: "Saved"
        })
      })

}

exports.getUserDetailById = (req, res) => {
  const { _id } = req.params;
  User.findById(_id)
     .select('name email phone')
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



//  exports.signout = (req, res) => {
//      res.clearCookie('token');
//      res.json({
//          message: 'Signout success'
//      });
//  };
//
//
//  exports.requireSignin = expressJwt({
//      secret: process.env.JWT_SECRET ,// req.user
//       algorithms: ['HS256']
//  });
//
//
//  exports.authMiddleware = (req, res, next) => {
//      const authUserId = req.user._id;
//      console.log(req.user._id)
//      User.findById({ _id: authUserId }).exec((err, user) => {
//          if (err || !user) {
//              return res.status(400).json({
//                  error: 'User not found'
//              });
//          }
//          req.profile = user;
//          next();
//      });
//  };
