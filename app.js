require('@dotenvx/dotenvx').config();
const express = require('express');
const app = express();

// Logger
const logger = require('morgan');
app.use(logger("tiny"));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error Handlers
const { generatedErrors } = require("./MiddleWares/errors");
const ErrorHandler = require('./MiddleWares/ErrorHandler');


app.use('/joinMeeting', require('./Routes/ZoomRoute'));


// Route not found 
app.use((req, res, next) => {
    next(new ErrorHandler(`Requested URL Not Found: ${req.url}`, 404));
});

app.use(generatedErrors);


app.listen(process.env.PORT, console.log(`Server running on port: ${process.env.PORT}`));