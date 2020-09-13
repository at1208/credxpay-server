const axios = require('axios');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const User = require('../models/auth_model');
const { errorHandler } = require('../helpers/dbErrorHandler');

module.exports.get_users = (req, res) => {
  let filter = req.params.filter;
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

if(filter === 'verified'){
 return User.find({ verified: true })
       .select('name email phone verified')
       .sort({ createdAt: -1 })
       .skip(skip)
       .limit(limit)
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
} else if (filter === "unverified") {
  return User.find({ verified: false })
       .select('name email phone verified')
       .sort({ createdAt: -1 })
       .skip(skip)
       .limit(limit)
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
  User.find()
     .select('name email phone verified')
     .sort({ createdAt: -1 })
     .skip(skip)
     .limit(limit)
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
