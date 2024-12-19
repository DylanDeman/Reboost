import Router from '@koa/router';
import * as healthService from '../service/health';
import type { ReboostContext, ReboostState } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type { PingResponse, VersionResponse } from '../types/health';

/**
 * @api {get} /health/ping Controleer de gezondheid van de API
 * @apiName PingHealth
 * @apiGroup Health
 * @apiSuccess {String} message Bevestiging dat de API actief is.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "message": "pong"
 *    }
 */
const ping = async (ctx: KoaContext<PingResponse>) => {
  ctx.status = 200;
  ctx.body = healthService.ping();
};

/**
 * @api {get} /health/version Haal de huidige versie van de API op
 * @apiName GetVersion
 * @apiGroup Health
 * @apiSuccess {String} version Versie van de API.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "version": "1.0.0"
 *    }
 */
const getVersion = async (ctx: KoaContext<VersionResponse>) => {
  ctx.status = 200;
  ctx.body = healthService.getVersion();
};

export default function installPlacesRoutes(parent: KoaRouter) {
  const router = new Router<ReboostState, ReboostContext>({ prefix: '/health' });

  router.get('/ping', ping);
  router.get('/version', getVersion);

  parent
    .use(router.routes())
    .use(router.allowedMethods());
};
