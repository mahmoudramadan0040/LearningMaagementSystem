import { LoggerOptions, format, transports, createLogger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`),
);

export const appLogger = createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      level: 'error',
      datePattern: 'YYYY-MM-DD',
    }),
  ],
});
