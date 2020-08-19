const express  = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors')
require('dotenv').config();
const app = express();


// middleware
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


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
app.listen(Port, () => `Listening on port ${Port}`)
