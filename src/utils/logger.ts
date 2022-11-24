import { v4 as uuidv4 } from 'uuid';
import { partialCall } from './partial-call';

function log(loggerName: string, logLevel: LogLevel, uuid: string, message: string): void {
  const prefix = `[${uuid}] [${new Date().toISOString()}] [${logLevel.toUpperCase()}]`;
  const { log, error, warn } = console;
  const action = logLevel == LogLevel.ERROR ? error : logLevel == LogLevel.WARN ? warn : log;
  action(`${prefix} ${loggerName} - ${message}`);
}

enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}
function createLogger(loggerName: string) {
  return Object.values(LogLevel).reduce((prev, logLevel) => {
    prev[logLevel] = partialCall(log, loggerName, logLevel, uuidv4());
    return prev;
  }, {} as Record<LogLevel, (message: string) => void>);
}

export const logger = createLogger('Quest_01_database_connection_testing');
