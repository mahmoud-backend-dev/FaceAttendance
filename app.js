require('express-async-errors');
require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 1812;


// Setting Security For App
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit')
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean')

const authRoute = require('./routes/auth');
const attendanceRoute = require('./routes/attendace');
const errorHandler = require('./middleware/error-handler');
const notFoundErr = require('./middleware/notFoundMiddleware');
const connectDB = require('./db/connectDB');


// Enable other domains to access your application
app.use(cors());
app.options('*', cors());

// Compress all responses
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'uploads')));

// To remove data using these defaults, To apply data sanitization
// nosql mongo injection
app.use(mongoSanitize());
// To sanitize user input coming from POST body, GET queries, and url params  ex: '<script></script>' to convert string ''&lt;script>&lt;/script>''
app.use(xss())


// Limit each IP to 100 requests per `window` (here, per 15 minutes)
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100, 
    message:
    'Too many accounts created from this IP, please try again after an 15 minutes'
})

// Apply the rate limiting middleware to all requests
app.use(limiter)


// Express middleware to protect against HTTP Parameter Pollution attacks
app.use(hpp())


app.use('/api/v1/auth', authRoute);
app.use('/api/v1/attendance', attendanceRoute);
app.use(errorHandler);
app.use(notFoundErr);

const start = async () => {
    try {
        await connectDB(process.env.URI);
        app.listen(port, () => console.log(`Listen server on http://localhost:${port}`));
    } catch (error) {
        console.log(error);
    }
};

start();