require('express-async-errors');
const winston = require('winston');

module.exports = function() {
    winston.exceptions.handle (
        new winston.transports.File({ filename: 'uncaughtException.log' }));
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });
    
    winston.add(winston.transports.File, { filename: 'logfile.log' });
}