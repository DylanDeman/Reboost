// src/rest/session.ts
import Router from '@koa/router';
import Joi from 'joi';
import validate from '../core/validation';
import * as userService from '../service/gebruiker';
import type {
  KoaContext,
  KoaRouter,
  ReboostState,
  ReboostContext,
} from '../types/koa';
import type { LoginResponse, LoginRequest } from '../types/gebruiker';

/**
 * @api {post} /sessions Login en verkrijg een JWT-token
 * @apiName Login
 * @apiGroup Session
 * @apiParam {String} email Email van de gebruiker.
 * @apiParam {String} wachtwoord Wachtwoord van de gebruiker.
 * @apiSuccess {String} token JWT-token dat wordt gebruikt voor authenticatie.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "token": "jwt_token_example"
 *    }
 * @apiError (401) Unauthorized Onjuiste inloggegevens.
 * @apiErrorExample {json} Error-Response:
 *    HTTP/1.1 401 Unauthorized
 *    {
 *      "code": "UNAUTHORIZED",
 *      "message": "Inloggegevens zijn onjuist"
 *    }
 */
const login = async (ctx: KoaContext<LoginResponse, void, LoginRequest>) => {
  const { naam, wachtwoord } = ctx.request.body;
  const token = await userService.login(naam, wachtwoord);

  ctx.status = 200;
  ctx.body = { token };
};

login.validationScheme = {
  body: {
    naam: Joi.string(),
    wachtwoord: Joi.string().min(6),
  },
};

export default function installSessionRouter(parent: KoaRouter) {
  const router = new Router<ReboostState, ReboostContext>({
    prefix: '/sessions',
  });

  // Login route
  router.post('/', validate(login.validationScheme), login);

  parent.use(router.routes()).use(router.allowedMethods());
}
