const mongoose = require('express');

const credxpay_setting_schema  =  mongoose.Schema({
      title: {
        type: String,
        required: true
      },
      benefits: [{ url: String, subtitle: String, description: String }],
      steps: [{ url: String, subtitle: String, description: String }],
      testimonials: [{{ url: String, subtitle: String, description: String }}]
      faqs: [{question: String, answer: String}]
})

module.exports = mongoose.model('Setting', credxpay_setting_schema)
