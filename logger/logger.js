const { createLogger, transports, format } = require('winston');

const logger = createLogger({
  level: 'info', // Set the logging level
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console(), // Log to console
    //new transports.File({ filename: 'combined.log' }) // Log to a file
  ]
});

module.exports = logger;
