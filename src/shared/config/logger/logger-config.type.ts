export type LoggerConfig = {
  colorize: boolean;
  prettyLogs: boolean;
  defaultLevel: LoggerLogLevel;
};

export enum LoggerLogLevel {
  Fatal = 'fatal',
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug',
  Trace = 'trace',
}
