import { type IncomingMessage, type ServerResponse } from 'node:http';
import { LoggerModule } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

export const setupLoggerModule = (
  customProps: (
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
  ) => Record<string, string> = () => ({}),
) => {
  return LoggerModule.forRootAsync({
    useFactory: async (configService: ConfigService) => {
      const defaultLevel = configService.getOrThrow('logger.defaultLevel', {
        infer: true,
      });

      const prettyLogs = configService.getOrThrow('logger.prettyLogs', {
        infer: true,
      });

      return {
        renameContext: 'class',
        pinoHttp: {
          customProps: (req, res) => {
            return customProps(req, res);
          },
          customSuccessObject: (
            req: IncomingMessage,
            res: ServerResponse,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            val: any,
          ) => {
            return {
              reqId: req.id,
              responseTime: val.responseTime,
            };
          },
          serializers: {
            req: (req) => ({
              method: req.method,
              url: req.url,
            }),
          },
          customErrorObject: (
            req: IncomingMessage,
            res: ServerResponse,
            error: Error,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            val: any,
          ) => {
            return {
              statusMessage: res.statusMessage,
              statusCode: res.statusCode,
              err: val.err,
            };
          },
          customSuccessMessage: (
            req: IncomingMessage,
            res: ServerResponse,
            responseTime: number,
          ) => {
            return `Finished Endpoint: ${req.method} ${req.url} for ${responseTime}ms`;
          },
          customErrorMessage: (
            req: IncomingMessage,
            res: ServerResponse,
            error: Error,
          ) => {
            return `Failed Endpoint: ${req.method} ${req.url} Error - ${error.message}.`;
          },
          // eslint-disable-next-line complexity
          customLogLevel: function (req, res, err) {
            if (res.statusCode >= 400 && res.statusCode < 500) {
              return 'info';
            } else if (res.statusCode >= 500 || err) {
              return 'error';
            } else if (res.statusCode >= 300 && res.statusCode < 400) {
              return 'silent';
            }
            return 'info';
          },

          quietReqLogger: true,
          autoLogging: true,
          level: defaultLevel,
          transport: prettyLogs ? { target: 'pino-pretty' } : undefined,
        },
      };
    },
    inject: [ConfigService],
    providers: [ConfigService],
  });
};
