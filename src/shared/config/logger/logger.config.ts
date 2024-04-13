import { registerAs } from '@nestjs/config';
import { LoggerConfig, LoggerLogLevel } from './logger-config.type';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { validateConfig } from '../../lib';

class EnvironmentVariablesValidator {
  @IsBoolean()
  @IsOptional()
  COLORIZE = true;

  @IsBoolean()
  @IsOptional()
  PRETTY_LOGS = true;

  @IsEnum(LoggerLogLevel)
  @IsOptional()
  DEFAULT_LEVEL = LoggerLogLevel.Info;
}

export default registerAs<LoggerConfig>('logger', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    colorize: Boolean(process.env.COLORIZE) || true,
    prettyLogs: Boolean(process.env.PRETTY_LOGS) || true,
    defaultLevel:
      (process.env.DEFAULT_LEVEL as LoggerLogLevel) || LoggerLogLevel.Info,
  };
});
