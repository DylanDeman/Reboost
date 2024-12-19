import Router from '@koa/router';
import * as GebruikerService from '../service/gebruiker';
import type { ReboostContext, ReboostState } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  GetAllGebruikersResponse,
  GetGebruikerByIdResponse,
  LoginResponse,
  UpdateGebruikerRequest,
  UpdateGebruikerResponse,
} from '../types/gebruiker';
import type { IdParams } from '../types/common';
import Joi from 'joi';

/**
 * @api {get} /gebruikers Haal alle gebruikers op
 * @apiName GetAllGebruikers
 * @apiGroup Gebruiker
 * @apiSuccess {Object[]} items Lijst van gebruikers.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "items": [
 *        {
 *          "id": 1,
 *          "naam": "Dylan De Man",
 *        }
 *      ]
 *    }
 */
const getAllGebruikers = async (ctx: KoaContext<GetAllGebruikersResponse>) => {
  const Gebruikers = await GebruikerService.getAll();
  ctx.body = { items: Gebruikers };
};

/**
 * @api {post} /gebruikers Registreer een nieuwe gebruiker
 * @apiName RegistreerGebruiker
 * @apiGroup Gebruiker
 * @apiParam {String} naam Naam van de gebruiker.
 * @apiParam {String} wachtwoord Wachtwoord van de gebruiker (min. 12 tekens).
 * @apiSuccess {String} token Auth-token voor de nieuwe gebruiker.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "token": "some-jwt-token"
 *    }
 */
const registreerGebruiker = async(ctx: KoaContext<LoginResponse, void, RegistreerGebruikerRequest>) => {
  const token = await GebruikerService.register(ctx.request.body);
  ctx.status = 200;
  ctx.body = { token };
};

registreerGebruiker.validationScheme = {
  body: {
    naam: Joi.string().max(255),
    wachtwoord: Joi.string().min(12).max(128),
  },
};

/**
 * @api {get} /gebruikers/:id Haal gebruiker op met ID
 * @apiName GetGebruikerById
 * @apiGroup Gebruiker
 * @apiParam {Number} id Gebruiker ID.
 * @apiSuccess {Object} gebruiker Gegevens van de gebruiker.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "naam": "Dylan De Man",
 *    }
 */
const getGebruikerById = async (ctx: KoaContext<GetGebruikerByIdResponse, IdParams>) => {
  const Gebruiker = await GebruikerService.getById(Number(ctx.params.id));
  ctx.status = 200;
  ctx.body = Gebruiker;
};

/**
 * @api {put} /gebruikers/:id Update gebruiker met ID
 * @apiName UpdateGebruikerById
 * @apiGroup Gebruiker
 * @apiParam {Number} id Gebruiker ID.
 * @apiParam {String} naam Naam van de gebruiker.
 * @apiParam {String} email (optioneel) Nieuwe e-mail van de gebruiker.
 * @apiParam {String} wachtwoord (optioneel) Nieuw wachtwoord van de gebruiker.
 * @apiSuccess {Object} gebruiker Geüpdatete gegevens van de gebruiker.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "naam": "Dylan De Man",
 *    }
 */
const updateGebruikerById = async (ctx: KoaContext<UpdateGebruikerResponse, IdParams, UpdateGebruikerRequest>) => {
  const Gebruiker = await GebruikerService.updateById(Number(ctx.params.id), ctx.request.body);
  ctx.status = 200;
  ctx.body = Gebruiker;
};

/**
 * @api {delete} /gebruikers/:id Verwijder gebruiker met ID
 * @apiName DeleteGebruikerById
 * @apiGroup Gebruiker
 * @apiParam {Number} id Gebruiker ID.
 * @apiSuccess {String} message Bevestiging van de verwijdering.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 204 No Content
 */
const deleteGebruikerById = async (ctx: KoaContext<void, IdParams>) => {
  await GebruikerService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

export default (parent: KoaRouter) => {
  const router = new Router<ReboostState, ReboostContext>({ prefix: '/gebruikers' });

  router.get('/', getAllGebruikers);
  router.get('/:id', getGebruikerById);
  router.post('/', registreerGebruiker);
  router.put('/:id', updateGebruikerById);
  router.delete('/:id', deleteGebruikerById);

  parent
    .use(router.routes())
    .use(router.allowedMethods());
};
