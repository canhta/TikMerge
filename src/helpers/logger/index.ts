import { DateTime } from 'luxon';
import { createLogger, format, Logger, transports } from 'winston';

export const getLogger = (component: string): Logger => {
  return createLogger({
    defaultMeta: { component },
    transports: [
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.simple(),
          format.printf((info) => `[${info.component}] ${info.level}: ${info.message}`)
        ),
      }),
    ],
  });
};

export const getFileLogger = (component: string): Logger => {
  const filename = `logs/${DateTime.now().toFormat('yyyy-MM-dd')}.json`;
  return createLogger({
    defaultMeta: { component },
    format: format.json(),
    transports: [new transports.File({ filename })],
  });
};
