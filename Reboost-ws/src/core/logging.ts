import winston from 'winston';
import config from 'config';

const {
  combine, timestamp, colorize, printf, errors,
} = winston.format;

const NODE_ENV = config.get<string>('env');
const LOG_LEVEL = config.get<string>('log.level');
const LOG_DISABLED = config.get<boolean>('log.disabled');

// Enhanced logger format with better structured logging
const loggerFormat = () => {
  const formatMessage = ({
    level, message, timestamp, requestId, ...rest
  }: winston.Logform.TransformableInfo) => {
    const requestIdStr = requestId ? `[${requestId}] ` : '';
    const meta = Object.keys(rest).length ? ` | ${JSON.stringify(rest)}` : '';
    return `${timestamp} | ${level} | ${requestIdStr}${message}${meta}`;
  };

  // Improved error formatting with full stack traces
  const formatError = ({
    error, ...rest
  }: winston.Logform.TransformableInfo) => {
    if (error instanceof Error) {
      const errorDetails = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
      return `${formatMessage({...rest, error: errorDetails})}\n\n${error.stack}\n`; 
    }
    return formatMessage(rest); 
  };
  
  const format = (info: winston.Logform.TransformableInfo) => {
    if (info?.['error'] instanceof Error) {
      return formatError(info);
    }
    return formatMessage(info);  
  };

  return combine(
    errors({ stack: true }), // Capture stack traces
    colorize(), 
    timestamp(), 
    printf(format),  
  );
};

const rootLogger: winston.Logger = winston.createLogger({
  level: LOG_LEVEL,
  format: loggerFormat(),
  defaultMeta: { env: NODE_ENV },
  transports: NODE_ENV === 'testing' ? [
    new winston.transports.File({
      filename: 'test.log',
      silent: LOG_DISABLED,
    }),
  ] : [
    new winston.transports.Console({ silent: LOG_DISABLED }),
  ],
});

// Enhanced logger with request tracking capability
export const getLogger = (requestId?: string) => {
  if (requestId) {
    return rootLogger.child({ requestId });
  }
  return rootLogger;
};

// Logger middleware for express
export const loggerMiddleware = (req: any, res: any, next: any) => {
  // Generate a unique request ID
  req.requestId = req.headers['x-request-id'] || 
                  `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Add request ID to response headers
  res.setHeader('x-request-id', req.requestId);
  
  // Log the request
  const logger = getLogger(req.requestId);
  logger.info(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });
  
  // Track response time
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`Response: ${res.statusCode}`, { 
      duration: `${duration}ms`,
      status: res.statusCode, 
    });
  });
  
  next();
};
