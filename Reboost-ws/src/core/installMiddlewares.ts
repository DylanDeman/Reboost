import config from 'config';
import bodyParser from 'koa-bodyparser';
import koaCors from '@koa/cors';
import koaHelmet from 'koa-helmet';
import { koaSwagger } from 'koa2-swagger-ui';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from '../../swagger.config';
import type { KoaApplication } from '../types/koa';
import { getLogger } from './logging';
import ServiceError from './serviceError';

const NODE_ENV = config.get<string>('env');
const CORS_ORIGINS = config.get<string[]>('cors.origins');
const CORS_MAX_AGE = config.get<number>('cors.maxAge');
const isDevelopment = NODE_ENV === 'development';

/**
 * @description Installs the middlewares for a Koa application, including:
 * - CORS support
 * - Request logging
 * - Body parsing (JSON)
 * - Helmet security settings
 * - Error handling (catching and logging errors)
 * - Swagger UI for API documentation (only in development)
 * 
 * @param {KoaApplication} app - The Koa application to install the middlewares on.
 */
export default function installMiddlewares(app: KoaApplication) {
  
  // CORS middleware for handling cross-origin requests
  app.use(koaCors({
    origin: (ctx) => {
      // Allow requests from origins specified in the config
      if (CORS_ORIGINS.indexOf(ctx.request.header.origin!) !== -1) {
        return ctx.request.header.origin!;
      }
      // Return the first valid origin if the origin is not in the list
      return CORS_ORIGINS[0] || '';
    },
    allowHeaders: [
      'Accept',
      'Content-Type',
      'Authorization',
    ],
    maxAge: CORS_MAX_AGE,
  }));

  // Request logging middleware
  app.use(async (ctx, next) => {
    // Log the incoming request
    getLogger().info(`⏩ ${ctx.method} ${ctx.url}`);

    const getStatusEmoji = () => {
      // Return an emoji based on the HTTP status code
      if (ctx.status >= 500) return '💀';
      if (ctx.status >= 400) return '❌';
      if (ctx.status >= 300) return '🔀';
      if (ctx.status >= 200) return '✅';
      return '🔄';
    };

    // Proceed with the request
    await next();

    // Log the response status
    getLogger().info(
      `${getStatusEmoji()} ${ctx.method} ${ctx.status} ${ctx.url}`,
    );
  });

  // Body parser middleware (for parsing JSON request bodies)
  app.use(bodyParser());

  // Helmet middleware for securing HTTP headers
  app.use(koaHelmet({
    contentSecurityPolicy: !isDevelopment, // Disable Content Security Policy (CSP) in development for ease of testing
  }));

  // Error handling middleware (catches and logs errors)
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (error: any) {
      // Log the error
      getLogger().error('Error occurred while handling a request', { error });

      let statusCode = error.status || 500;
      const errorBody = {
        code: error.code || 'INTERNAL_SERVER_ERROR',
        // Avoid exposing error message in production
        message: error.message || 'Unexpected error occurred. Please try again later.',
        details: error.details,
        stack: NODE_ENV !== 'production' ? error.stack : undefined,
      };

      // Handle ServiceError types for more specific error codes
      if (error instanceof ServiceError) {
        errorBody.message = error.message;

        if (error.isNotFound) {
          statusCode = 404;
        }

        if (error.isValidationFailed) {
          statusCode = 400;
        }

        if (error.isUnauthorized) {
          statusCode = 401;
        }

        if (error.isForbidden) {
          statusCode = 403;
        }

        if (error.isConflict) {
          statusCode = 409;
        }
      }

      ctx.status = statusCode;
      ctx.body = errorBody;
    }
  });

  // Swagger UI middleware (only for development)
  if (isDevelopment) {
    const spec = swaggerJsdoc(swaggerOptions) as Record<string, unknown>;

    app.use(
      koaSwagger({
        routePrefix: '/swagger',  // Swagger UI will be available at /swagger
        specPrefix: '/swagger.json', // Swagger spec will be available at /swagger.json
        exposeSpec: true, // Expose the Swagger spec file
        swaggerOptions: { spec },
      }),
    );
  }

  // 404 handler if the route is not found
  app.use(async (ctx, next) => {
    await next();

    if (ctx.status === 404) {
      ctx.status = 404;
      ctx.body = {
        code: 'NOT_FOUND',
        message: `Unknown resource: ${ctx.url}`,
      };
    }
  });
}
