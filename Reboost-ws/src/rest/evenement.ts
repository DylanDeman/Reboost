import Router from '@koa/router';
import * as EvenementService from '../service/evenement';
import type { ReboostContext, ReboostState } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import Joi from 'joi';
import type {
  CreateEvenementRequest,
  CreateEvenementResponse,
  GetAllEvenementenReponse,
  GetEvenementByIdResponse,
  UpdateEvenementRequest,
  UpdateEvenementResponse,
} from '../types/evenement';
import type { IdParams } from '../types/common';
import validate from '../core/validation';

/**
 * @api {get} /evenementen Haal alle evenementen op
 * @apiName GetAllEvenementen
 * @apiGroup Evenement
 * @apiSuccess {Object[]} items Lijst van evenementen.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "items": [
 *        {
 *          "id": 1,
 *          "naam": "Evenement 1",
 *          "datum": "2024-01-01T00:00:00Z",
 *          "plaats_id": 2,
 *          "auteur_id": 1
 *        }
 *      ]
 *    }
 */
const getAllEvenementen = async (ctx: KoaContext<GetAllEvenementenReponse>) => {
  ctx.body = {
    items: await EvenementService.getAll(),
  };
};

getAllEvenementen.validationScheme = null;

/**
 * @api {post} /evenementen Maak een nieuw evenement aan
 * @apiName CreateEvenement
 * @apiGroup Evenement
 * @apiParam {String} naam Naam van het evenement.
 * @apiParam {Date} datum Datum van het evenement.
 * @apiParam {Number} auteur_id ID van de auteur.
 * @apiParam {Number} plaats_id ID van de plaats.
 * @apiSuccess {Object} evenement Gecreëerd evenement.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 201 Created
 *    {
 *      "id": 1,
 *      "naam": "Nieuw Evenement",
 *      "datum": "2024-01-01T00:00:00Z",
 *      "plaats_id": 2,
 *      "auteur_id": 1
 *    }
 */
const createEvenement = async (ctx: KoaContext<CreateEvenementResponse, void, CreateEvenementRequest>) => {
  const newEvenement = await EvenementService.create({
    ...ctx.request.body,
    plaats_id: Number(ctx.request.body.plaats_id),
    auteur_id: Number(ctx.request.body.auteur_id),
    datum: new Date(ctx.request.body.datum),
  });
  ctx.body = newEvenement;
};

createEvenement.validationScheme = {
  body: {
    naam: Joi.string().required(),
    datum: Joi.date().iso(),
    auteur_id: Joi.number().integer().positive().required(),
    plaats_id: Joi.number().integer().positive().required(),
    gereedschap_ids: Joi.array().items(Joi.number().integer().positive()).optional(),
  },
};

/**
 * @api {get} /evenementen/:id Haal evenement op met ID
 * @apiName GetEvenementById
 * @apiGroup Evenement
 * @apiParam {Number} id Evenement ID.
 * @apiSuccess {Object} evenement Het evenement met het opgegeven ID.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "naam": "Evenement 1",
 *      "datum": "2024-01-01T00:00:00Z",
 *      "plaats_id": 2,
 *      "auteur_id": 1
 *    }
 */
const getEvenementById = async (ctx: KoaContext<GetEvenementByIdResponse, IdParams>) => {
  ctx.body = await EvenementService.getById(Number(ctx.params.id));
};

getEvenementById.validationScheme = {

  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @api {put} /evenementen/:id Update evenement met ID
 * @apiName UpdateEvenement
 * @apiGroup Evenement
 * @apiParam {Number} id Evenement ID.
 * @apiParam {String} naam Naam van het evenement.
 * @apiParam {Date} datum Datum van het evenement.
 * @apiParam {Number} auteur_id ID van de auteur.
 * @apiParam {Number} plaats_id ID van de plaats.
 * @apiSuccess {Object} evenement Geüpdatet evenement.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "naam": "Bijgewerkt Evenement",
 *      "datum": "2024-01-01T00:00:00Z",
 *      "plaats_id": 2,
 *      "auteur_id": 1
 *    }
 */
const updateEvenement = async (
  ctx: KoaContext<UpdateEvenementResponse, IdParams, UpdateEvenementRequest>,
) => {
  ctx.body = await EvenementService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    plaats_id: Number(ctx.request.body.plaats_id),
    auteur_id: Number(ctx.request.body.auteur_id),
    datum: new Date(ctx.request.body.datum),
    gereedschap_ids: ctx.request.body.gereedschap_ids ?? [],
  });
};

/**
 * @api {delete} /evenementen/:id Verwijder evenement met ID
 * @apiName DeleteEvenement
 * @apiGroup Evenement
 * @apiParam {Number} id Evenement ID.
 * @apiSuccess {String} message Bevestiging van de verwijdering.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 204 No Content
 */
const deleteEvenement = async (ctx: KoaContext<void, IdParams>) => {
  await EvenementService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

export default (parent: KoaRouter) => {
  const router = new Router<ReboostState, ReboostContext>({
    prefix: '/evenementen',
  });

  router.get(
    '/',
    validate(getAllEvenementen.validationScheme),
    getAllEvenementen,
  );
  router.post(
    '/',
    validate(createEvenement.validationScheme),
    createEvenement,
  );
  router.get(
    '/:id',
    validate(getEvenementById.validationScheme),
    getEvenementById,
  );
  router.put('/:id', updateEvenement);
  router.delete('/:id', deleteEvenement);

  parent.use(router.routes())
    .use(router.allowedMethods());
};
