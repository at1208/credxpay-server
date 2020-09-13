const express  = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors')
require('dotenv').config();
const app = express();

const otpRoutes = require('./routes/auth_route');
const beneficiaryRoutes = require('./routes/beneficiary_route');
const paymentRoutes = require('./routes/payment_route');
const payoutRoutes = require('./routes/payout_route');
const userRoutes = require('./routes/user_route');
const adminSettingRoutes = require('./routes/admin_setting_route');

// middleware
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', otpRoutes);
app.use('/api', beneficiaryRoutes);
app.use('/api', paymentRoutes);
app.use('/api', payoutRoutes);
app.use('/api', userRoutes);
app.use('/api', adminSettingRoutes);

// database
mongoose.connect(process.env.DATABASE, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	})
	.then(() => console.log('Connected to Database'))
	.catch((err) => console.log(`Error: ${err}`));

const Port = process.env.PORT || 8000;
app.listen(Port, () => console.log(`Listening on port ${Port}`))
