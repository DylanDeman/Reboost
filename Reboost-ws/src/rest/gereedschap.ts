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

// GET /gereedschap — list all
const listGereedschap = async (ctx: KoaContext<GereedschapListResponse>) => {
  const gereedschappen = await gereedschapService.getAll();
  ctx.body = { items: gereedschappen };
};
listGereedschap.validationScheme = null;

// GET /gereedschap/:id — get one by ID
const getGereedschapById = async (ctx: KoaContext<GereedschapByIdResponse, IdParams>) => {
  ctx.body = await gereedschapService.getById(Number(ctx.params.id));
};
getGereedschapById.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
};

// POST /gereedschap — create
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

// PUT /gereedschap/:id — update
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

// DELETE /gereedschap/:id — delete
const deleteGereedschap = async (ctx: KoaContext<void, IdParams>) => {
  await gereedschapService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};
deleteGereedschap.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
};

// GET /gereedschap/:id/evenement — get event
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
