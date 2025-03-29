import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const logFormat = format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

export const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json(), logFormat),
  transports: [
    new transports.Console(),
    new transports.DailyRotateFile({
      filename: 'logs/security-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
    }),
  ],
});
