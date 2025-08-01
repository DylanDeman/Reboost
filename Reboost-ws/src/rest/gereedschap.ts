import Router from '@koa/router';
import Joi from 'joi';
import { GereedschapService } from '../service/gereedschap';

import validate from '../core/validation';

import type { KoaContext, KoaRouter, ReboostContext, ReboostState } from '../types/koa';
import type { IdParams } from '../types/common';
import type {
  GereedschapCreateInput,
  GereedschapUpdateInput,
  GereedschapListResponse,
  GereedschapByIdResponse,
  GereedschapCreateResponse,
  GereedschapUpdateResponse,
  GereedschapDeleteResponse,
  GereedschapEventResponse,
} from '../types/gereedschap';

/**
 * @api {get} /gereedschap Haal alle gereedschappen op
 */
const listGereedschap = async (ctx: KoaContext<GereedschapListResponse>) => {
  const { gereedschappen, totalCount } = await GereedschapService.list();
  ctx.body = {
    gereedschappen,
    totalCount,
  };
};
listGereedschap.validationScheme = null;

/**
 * @api {get} /gereedschap/:id Haal één gereedschap op
 */
const getGereedschapById = async (ctx: KoaContext<GereedschapByIdResponse, IdParams>) => {
  ctx.body = await GereedschapService.getById(Number(ctx.params.id));
};
getGereedschapById.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
};

/**
 * @api {post} /gereedschap Maak een nieuw gereedschap aan
 */
const createGereedschap = async (
  ctx: KoaContext<GereedschapCreateResponse, void, GereedschapCreateInput>,
) => {
  const data: GereedschapCreateInput = {
    naam: ctx.request.body.naam,
    beschrijving: ctx.request.body.beschrijving,
    beschikbaar: ctx.request.body.beschikbaar,
    evenementId: undefined,
  };

  // Only connect evenement if evenementId is passed and valid
  if (ctx.request.body.evenementId) {
    data.evenementId = Number(ctx.request.body.evenementId);
  }

  const gereedschap = await GereedschapService.create(data);
  ctx.status = 201;
  ctx.body = gereedschap;
};
createGereedschap.validationScheme = {
  body: {
    naam: Joi.string().required(),
    beschrijving: Joi.string().allow('', null),
    beschikbaar: Joi.boolean().required(),
    verhuurd: Joi.boolean().required(),
    evenementId: Joi.number().integer().positive().optional(),
  },
};

const updateGereedschap = async (
  ctx: KoaContext<GereedschapUpdateResponse, IdParams, GereedschapUpdateInput>,
) => {
  const data: GereedschapUpdateInput = { ...ctx.request.body };

  if ('evenementId' in ctx.request.body) {
    if (ctx.request.body.evenementId) {
      data.evenementId = Number(ctx.request.body.evenementId);
    } else {
      data.evenementId = undefined; 
    }
  } else {

    delete data.evenementId;
  }

  ctx.body = await GereedschapService.update(Number(ctx.params.id), data);
};
updateGereedschap.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
  body: {
    naam: Joi.string().optional(),
    beschrijving: Joi.string().allow('', null).optional(),
    beschikbaar: Joi.boolean().optional(),
    verhuurd: Joi.boolean().optional(),
    evenementId: Joi.number().integer().positive().allow(null).optional(),
  },
};
/**
 * @api {delete} /gereedschap/:id Verwijder gereedschap
 */
const deleteGereedschap = async (ctx: KoaContext<GereedschapDeleteResponse, IdParams>) => {
  ctx.body = await GereedschapService.delete(Number(ctx.params.id));
  ctx.status = 200;
};
deleteGereedschap.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
};

/**
 * @api {get} /gereedschap/:id/evenement Haal gekoppeld evenement op
 */
const getEventByGereedschapId = async (
  ctx: KoaContext<GereedschapEventResponse, IdParams>,
) => {
  ctx.body = await GereedschapService.getEventByGereedschapId(Number(ctx.params.id));
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

  router.get('/', validate(listGereedschap.validationScheme), listGereedschap);
  router.post('/', validate(createGereedschap.validationScheme), createGereedschap);
  router.get('/:id', validate(getGereedschapById.validationScheme), getGereedschapById);
  router.put('/:id', validate(updateGereedschap.validationScheme), updateGereedschap);
  router.delete('/:id', validate(deleteGereedschap.validationScheme), deleteGereedschap);
  router.get('/:id/evenement', validate(getEventByGereedschapId.validationScheme), getEventByGereedschapId);

  parent.use(router.routes()).use(router.allowedMethods());
};
