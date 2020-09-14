const express = require('express');
const router = express.Router();

const { send_otp, verify_otp,saveUserDetails, getUserDetailById} = require('../controllers/auth_controller');
// const { requireSignin, authMiddleware } = require('../controllers/auth');

// const { userValidator } = require('../validators/user');

router.post('/send/otp', send_otp);
router.post('/verify/otp', verify_otp);
router.patch('/user/details', saveUserDetails);
router.get('/user/details/:_id', getUserDetailById);
// router.get('/signout', signout);

module.exports = router;
