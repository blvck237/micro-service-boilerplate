import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize, label, prettyPrint } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${level} [${label}]: ${timestamp} ${message}`;
});

// Capitalize the first letter of the service name
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), colorize(), label({ label: process.env.SERVICE_NAME }), prettyPrint(), myFormat),
  transports: [new transports.Console()],
});

export default logger;
