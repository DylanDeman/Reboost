import Router from '@koa/router';
import Joi from 'joi';
import * as PlaatsService from '../service/plaats';
import type { ReboostContext, ReboostState } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  CreatePlaatsRequest,
  CreatePlaatsResponse,
  GetAllPlaatsResponse,
  GetPlaatsByIdResponse,
  UpdatePlaatsRequest,
  UpdatePlaatsResponse,
} from '../types/plaats';
import type { IdParams } from '../types/common';

import { requireAuthentication } from '../core/auth';
import validate from '../core/validation';

const idParamSchema = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
};

const createPlaatsSchema = {
  body: {
    naam: Joi.string().max(255).required(),
    straat: Joi.string().required(),
    huisnummer: Joi.string().max(255).required(),
    postcode: Joi.string().max(255).required(),
    gemeente: Joi.string().max(255).required(),
  },
};

const updatePlaatsSchema = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
  body: {
    naam: Joi.string().max(255).required(),
    straat: Joi.string().required(),
    huisnummer: Joi.string().max(255).required(),
    postcode: Joi.string().max(255).required(),
    gemeente: Joi.string().max(255).required(),
  },
};

/**
 * @api {get} /plaatsen Haal alle plaatsen op
 * @apiName GetAllPlaatsen
 * @apiGroup Plaats
 * @apiSuccess {Object[]} items Lijst van plaatsen.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "items": [
 *        {
 *          "id": 1,
 *          "naam": "Concertzaal 9200 Dendermonde",
 *          "adres": "Damstraat 1, 9200 Dendermonde"
 *        }
 *      ]
 *    }
 */
const getAllPlaatsen = async (ctx: KoaContext<GetAllPlaatsResponse>) => {
  const plaats = await PlaatsService.getAll();
  ctx.body = { items: plaats };
};

/**
 * @api {get} /plaatsen/:id Haal een plaats op via ID
 * @apiName GetPlaatsById
 * @apiGroup Plaats
 * @apiParam {Number} id ID van de plaats
 * @apiSuccess {Object} plaats Gegevens van de opgehaalde plaats.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "naam": "Concertzaal Dendermonde",
 *      "adres": "Damstraat 1, 9200 Dendermonde"
 *    }
 */
const getPlaatsById = async (ctx: KoaContext<GetPlaatsByIdResponse, IdParams>) => {
  const plaats = await PlaatsService.getById(Number(ctx.params.id));
  ctx.body = plaats;
};

/**
 * @api {post} /plaatsen Maak een nieuwe plaats aan
 * @apiName CreatePlaats
 * @apiGroup Plaats
 * @apiParam (Request body) {String} naam Naam van de plaats.
 * @apiParam (Request body) {String} straat Straat van de plaats.
 * @apiParam (Request body) {String} huisnummer Huisnummer van de plaats.
 * @apiParam (Request body) {String} postcode Postcode van de plaats.
 * @apiParam (Request body) {String} gemeente Gemeente van de plaats.
 * @apiSuccess {Object} plaats Gegevens van de nieuw aangemaakte plaats.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 201 Created
 *    {
 *      "id": 2,
 *      "naam": "Nieuwe Locatie",
 *      "straat": "Nieuwstraat",
 *      "huisnummer": "5",
 *      "postcode": "9200",
 *      "gemeente": "Dendermonde"
 *    }
 */
const createPlaats = async (ctx: KoaContext<CreatePlaatsResponse, void, CreatePlaatsRequest>) => {
  const plaats = await PlaatsService.create(ctx.request.body);
  ctx.status = 201;
  ctx.body = plaats;
};

/**
 * @api {put} /plaatsen/:id Werk een bestaande plaats bij
 * @apiName UpdatePlaats
 * @apiGroup Plaats
 * @apiParam {Number} id ID van de te updaten plaats.
 * @apiParam (Request body) {String} naam Naam van de plaats.
 * @apiParam (Request body) {String} straat Straat van de plaats.
 * @apiParam (Request body) {String} huisnummer Huisnummer van de plaats.
 * @apiParam (Request body) {String} postcode Postcode van de plaats.
 * @apiParam (Request body) {String} gemeente Gemeente van de plaats.
 * @apiSuccess {Object} plaats Gegevens van de bijgewerkte plaats.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "naam": "Bijgewerkte Locatie",
 *      "straat": "Nieuwe Straat",
 *      "huisnummer": "10",
 *      "postcode": "9200",
 *      "gemeente": "Dendermonde"
 *    }
 */
const updatePlaats = async (ctx: KoaContext<UpdatePlaatsResponse, IdParams, UpdatePlaatsRequest>) => {
  const plaats = await PlaatsService.updateById(Number(ctx.params.id), ctx.request.body);
  ctx.body = plaats;
};

/**
 * @api {delete} /plaatsen/:id Verwijder een plaats
 * @apiName DeletePlaats
 * @apiGroup Plaats
 * @apiParam {Number} id ID van de plaats die verwijderd moet worden.
 * @apiSuccess {String} message Bevestiging dat de plaats succesvol is verwijderd.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 204 No Content
 */
const deletePlaats = async (ctx: KoaContext<void, IdParams>) => {
  await PlaatsService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

export default (parent: KoaRouter) => {
  const router = new Router<ReboostState, ReboostContext>({
    prefix: '/plaatsen',
  });

  router.get('/', getAllPlaatsen);
  router.get('/:id', requireAuthentication, validate(idParamSchema), getPlaatsById);
  router.post('/', requireAuthentication, validate(createPlaatsSchema), createPlaats);
  router.put('/:id', requireAuthentication, validate(updatePlaatsSchema), updatePlaats);
  router.delete('/:id', requireAuthentication, validate(idParamSchema), deletePlaats);

  parent.use(router.routes()).use(router.allowedMethods());
};
