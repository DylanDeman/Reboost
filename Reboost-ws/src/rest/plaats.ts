import Router from '@koa/router';
import * as PlaatsService from '../service/plaats';
import * as EvenementenService from '../service/evenement';
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
import type { GetAllEvenementenReponse } from '../types/evenement';

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
  ctx.body = {
    items: plaats,
  };
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
 * @apiParam {String} naam Naam van de plaats.
 * @apiParam {String} adres Adres van de plaats.
 * @apiSuccess {Object} plaats Gegevens van de nieuw aangemaakte plaats.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 201 Created
 *    {
 *      "id": 2,
 *      "naam": "Nieuwe Locatie",
 *      "adres": "Nieuwstraat 5, 9200 Dendermonde"
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
 * @apiParam {String} naam Naam van de plaats.
 * @apiParam {String} adres Adres van de plaats.
 * @apiSuccess {Object} plaats Gegevens van de bijgewerkte plaats.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "naam": "Bijgewerkte Locatie",
 *      "adres": "Nieuwe Straat 10, 9200 Dendermonde"
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

/**
 * @api {get} /plaatsen/:id/transactions Haal evenementen op voor een plaats
 * @apiName GetEvenementsByPlaatsId
 * @apiGroup Plaats
 * @apiParam {Number} id ID van de plaats waarvoor de evenementen opgehaald moeten worden.
 * @apiSuccess {Object[]} items Lijst van evenementen die plaatsvinden op deze plaats.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "items": [
 *        {
 *          "id": 1,
 *          "naam": "testEvenement",
 *          "datum": "2024-07-01T19:00:00Z"
 *        }
 *      ]
 *    }
 */
const getEvenementsByPlaatsId = async (ctx: KoaContext<GetAllEvenementenReponse, IdParams>) => {
  const evenementen = await EvenementenService.getEvenementenByPlaceId(Number(ctx.params.id));
  ctx.body = {
    items: evenementen,
  };
};

export default (parent: KoaRouter) => {
  const router = new Router<ReboostState, ReboostContext>({
    prefix: '/plaatsen',
  });

  router.get('/', getAllPlaatsen);
  router.get('/:id', getPlaatsById);
  router.post('/', createPlaats);
  router.put('/:id', updatePlaats);
  router.delete('/:id', deletePlaats);

  // Haal evenementen op voor een specifieke plaats
  router.get('/:id/transactions', getEvenementsByPlaatsId);

  parent.use(router.routes())
    .use(router.allowedMethods());
};
