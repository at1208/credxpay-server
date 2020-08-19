const mongoose = require('express');

const user_schema  =  mongoose.Schema({
      name: {
        type: String
      },
      phone: {
        type: String,
        required: true
      },
      email: {
        type: String
      },
      verified: {
        type: Boolean,
        default: false
      },
      role: {
        type: Number,
        default: 0
      }
})

module.exports = mongoose.model('Setting', user_schema)
