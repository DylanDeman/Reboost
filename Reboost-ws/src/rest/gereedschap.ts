import Router from '@koa/router';
import Joi from 'joi';
import validate from '../core/validation';
import * as gereedschapService from '../service/gereedschap';

import type { KoaContext, KoaRouter, ReboostContext, ReboostState } from '../types/koa';
import type { IdParams } from '../types/common';
import type {
  GereedschapCreateInput,
  GereedschapUpdateInput,
  GereedschapListResponse,
  GereedschapByIdResponse,
  GereedschapCreateResponse,
  GereedschapUpdateResponse,
  GereedschapEventResponse,
} from '../types/gereedschap';
import { requireAuthentication } from '../core/auth';

/**
 * @api {get} /gereedschap List all gereedschap
 * @apiName ListGereedschap
 * @apiGroup Gereedschap
 * @apiPermission authenticated
 *
 * @apiSuccess {Object[]} items List of gereedschap items
 * @apiSuccess {Number} items.id Gereedschap ID
 * @apiSuccess {String} items.naam Name of the gereedschap
 * @apiSuccess {String} items.beschrijving Description
 * @apiSuccess {Boolean} items.beschikbaar Availability status
 * @apiSuccess {Number} [items.evenementId] Associated event ID (optional)
 */
const listGereedschap = async (ctx: KoaContext<GereedschapListResponse>) => {
  const gereedschappen = await gereedschapService.getAll();
  ctx.body = { items: gereedschappen };
};
listGereedschap.validationScheme = null;

/**
 * @api {get} /gereedschap/:id Get gereedschap by ID
 * @apiName GetGereedschapById
 * @apiGroup Gereedschap
 * @apiPermission authenticated
 *
 * @apiParam {Number} id Gereedschap unique ID
 *
 * @apiSuccess {Number} id Gereedschap ID
 * @apiSuccess {String} naam Name of the gereedschap
 * @apiSuccess {String} beschrijving Description
 * @apiSuccess {Boolean} beschikbaar Availability status
 * @apiSuccess {Number} [evenementId] Associated event ID (optional)
 */
const getGereedschapById = async (ctx: KoaContext<GereedschapByIdResponse, IdParams>) => {
  ctx.body = await gereedschapService.getById(Number(ctx.params.id));
};
getGereedschapById.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
};

/**
 * @api {post} /gereedschap Create new gereedschap
 * @apiName CreateGereedschap
 * @apiGroup Gereedschap
 * @apiPermission authenticated
 *
 * @apiBody {String} naam Name of the gereedschap
 * @apiBody {String} [beschrijving] Description of the gereedschap
 * @apiBody {Boolean} beschikbaar Availability status
 * @apiBody {Number} [evenementId] Associated event ID (optional)
 *
 * @apiSuccess (201) {Number} id New gereedschap ID
 * @apiSuccess {String} naam Name
 * @apiSuccess {String} beschrijving Description
 * @apiSuccess {Boolean} beschikbaar Availability
 * @apiSuccess {Number} [evenementId] Associated event ID
 */
const createGereedschap = async (
  ctx: KoaContext<GereedschapCreateResponse, void, GereedschapCreateInput>,
) => {
  const data: GereedschapCreateInput = {
    naam: ctx.request.body.naam,
    beschrijving: ctx.request.body.beschrijving,
    beschikbaar: ctx.request.body.beschikbaar,
    evenementId: ctx.request.body.evenementId ?? null,
  };

  const gereedschap = await gereedschapService.create(data);
  ctx.status = 201;
  ctx.body = gereedschap;
};
createGereedschap.validationScheme = {
  body: {
    naam: Joi.string().required(),
    beschrijving: Joi.string().allow('', null),
    beschikbaar: Joi.boolean().required(),
    evenementId: Joi.number().integer().positive().allow(null).optional(),
  },
};

/**
 * @api {put} /gereedschap/:id Update gereedschap by ID
 * @apiName UpdateGereedschap
 * @apiGroup Gereedschap
 * @apiPermission authenticated
 *
 * @apiParam {Number} id Gereedschap unique ID
 *
 * @apiBody {String} [naam] Name
 * @apiBody {String} [beschrijving] Description
 * @apiBody {Boolean} [beschikbaar] Availability
 * @apiBody {Number} [evenementId] Associated event ID (optional)
 *
 * @apiSuccess {Number} id Updated gereedschap ID
 * @apiSuccess {String} naam Updated name
 * @apiSuccess {String} beschrijving Updated description
 * @apiSuccess {Boolean} beschikbaar Updated availability
 * @apiSuccess {Number} [evenementId] Updated event ID
 */
const updateGereedschap = async (
  ctx: KoaContext<GereedschapUpdateResponse, IdParams, GereedschapUpdateInput>,
) => {
  const id = Number(ctx.params.id);
  const body = ctx.request.body;

  const data: GereedschapUpdateInput = {};
  
  if (body.naam !== undefined) data.naam = body.naam;
  if (body.beschrijving !== undefined) data.beschrijving = body.beschrijving;
  if (body.beschikbaar !== undefined) data.beschikbaar = body.beschikbaar;
  if (body.evenementId !== undefined) data.evenementId = body.evenementId;

  ctx.body = await gereedschapService.updateById(id, data);
};
updateGereedschap.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
  body: {
    naam: Joi.string().optional(),
    beschrijving: Joi.string().allow('', null).optional(),
    beschikbaar: Joi.boolean().optional(),
    evenementId: Joi.number().integer().positive().allow(null).optional(),
  },
};

/**
 * @api {delete} /gereedschap/:id Delete gereedschap by ID
 * @apiName DeleteGereedschap
 * @apiGroup Gereedschap
 * @apiPermission authenticated
 *
 * @apiParam {Number} id Gereedschap unique ID
 *
 * @apiSuccess (204) No Content Gereedschap deleted
 */
const deleteGereedschap = async (ctx: KoaContext<void, IdParams>) => {
  await gereedschapService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};
deleteGereedschap.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
};

/**
 * @api {get} /gereedschap/:id/evenement Get event by gereedschap ID
 * @apiName GetEventByGereedschapId
 * @apiGroup Gereedschap
 * @apiPermission authenticated
 *
 * @apiParam {Number} id Gereedschap unique ID
 *
 * @apiSuccess {Object} gereedschap Gereedschap details
 * @apiSuccess {Object|null} evenement Associated event, or null if none
 */
const getEventByGereedschapId = async (
  ctx: KoaContext<GereedschapEventResponse, IdParams>,
) => {
  const gereedschap = await gereedschapService.getById(Number(ctx.params.id));

  ctx.body = {
    gereedschap: gereedschap,
    evenement: gereedschap.evenement || null,
  };
};
getEventByGereedschapId.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
};

// REGISTER ROUTES
export default (parent: KoaRouter) => {
  const router = new Router<ReboostState, ReboostContext>({
    prefix: '/gereedschap',
  });

  router.get('/', validate(listGereedschap.validationScheme), listGereedschap, requireAuthentication);
  router.post('/', validate(createGereedschap.validationScheme), createGereedschap, requireAuthentication);
  router.get('/:id', validate(getGereedschapById.validationScheme), getGereedschapById, requireAuthentication);
  router.put('/:id', validate(updateGereedschap.validationScheme), updateGereedschap, requireAuthentication);
  router.delete('/:id', validate(deleteGereedschap.validationScheme), deleteGereedschap, requireAuthentication);
  router.get('/:id/evenement', validate(getEventByGereedschapId.validationScheme), getEventByGereedschapId, requireAuthentication);

  parent.use(router.routes()).use(router.allowedMethods());
};
