import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileLoggerService implements LoggerService {
  private logPath = path.join(__dirname, '../../../logs/app.log');

  constructor() {
    // Create logs folder if missing
    const logDir = path.dirname(this.logPath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(message: string) {
    this.write('LOG', message);
  }

  error(message: string, trace?: string) {
    this.write('ERROR', `${message} - ${trace || ''}`);
  }

  warn(message: string) {
    this.write('WARN', message);
  }

  private write(level: string, message: string) {
    const log = `[${new Date().toISOString()}] [${level}] ${message}\n`;

    // Write to console
    console.log(log);

    // Write to file
    fs.appendFileSync(this.logPath, log, { encoding: 'utf8' });
  }
}
