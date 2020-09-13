const mongoose =  require('mongoose');
const userSchema  = mongoose.Schema({
   name: {
     type: String
   },
   email: {
     type: String
   },
   phone: {
     type: String,
     required: true,
     unique: true
   },
   verified: {
     type: Boolean,
     default: false
   },
   role: {
     type: Number,
     default: 0
   }
},{ timestamps: true })
module.exports = mongoose.model('User', userSchema);
