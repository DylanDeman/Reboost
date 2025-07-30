import type { Next } from 'koa';
import Router from '@koa/router';
import Joi from 'joi';
import * as GebruikerService from '../service/gebruiker';
import type { ReboostContext, ReboostState } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  RegisterGebruikerRequest,
  GetAllGebruikersResponse,
  GetGebruikerByIdResponse,
  UpdateGebruikerRequest,
  UpdateGebruikerResponse,
  LoginResponse,
  GetGebruikerRequest,
} from '../types/gebruiker';
import type { IdParams } from '../types/common';
import validate from '../core/validation';
import { requireAuthentication, authDelay } from '../core/auth';

const checkUserId = (ctx: KoaContext<unknown, GetGebruikerRequest>, next: Next) => {
  const { userId } = ctx.state.session;
  const { id } = ctx.params;

  if (id !== 'me' && id !== userId) {
    return ctx.throw(
      403,
      'Je hebt geen toegang tot deze gebruiker',
      { code: 'FORBIDDEN' },
    );
  }
  return next();
};

const getAllGebruikers = async (ctx: KoaContext<GetAllGebruikersResponse>) => {
  const users = await GebruikerService.getAll();
  ctx.body = { items: users };
};
getAllGebruikers.validationScheme = null;

const registerUser = async (ctx: KoaContext<LoginResponse, void, RegisterGebruikerRequest>) => {
  const token = await GebruikerService.register(ctx.request.body);
  ctx.status = 200;
  ctx.body = { token };
};
registerUser.validationScheme = {
  body: {
    naam: Joi.string().max(255).required(),
    wachtwoord: Joi.string().min(12).max(255).required(),
    roles: Joi.array().items(Joi.string()).default([]).optional(),
  },
};

const getUserById = async (ctx: KoaContext<GetGebruikerByIdResponse, GetGebruikerRequest>) => {
  const user = await GebruikerService.getById(
    ctx.params.id === 'me' ? ctx.state.session.userId : ctx.params.id,
  );
  ctx.status = 200;
  ctx.body = user;
};
getUserById.validationScheme = {
  params: {
    id: Joi.alternatives().try(
      Joi.number().integer().positive(),
      Joi.string().valid('me'),
    ),
  },
};

const updateUserById = async (ctx: KoaContext<UpdateGebruikerResponse, IdParams, UpdateGebruikerRequest>) => {
  const user = await GebruikerService.updateById(ctx.params.id, ctx.request.body);
  ctx.status = 200;
  ctx.body = user;
};
updateUserById.validationScheme = {
  params: { id: Joi.number().integer().positive() },
  body: {
    naam: Joi.string().max(255).optional(),
    roles: Joi.array().items(Joi.string()).default([]).optional(),
    wachtwoord: Joi.string().min(12).max(255).optional(),
  },
};

const deleteUserById = async (ctx: KoaContext<void, IdParams>) => {
  await GebruikerService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default function installUserRoutes(parent: KoaRouter) {
  const router = new Router<ReboostState, ReboostContext>({ prefix: '/gebruikers' });

  // Voor register is er geen authenticatie nodig
  router.post(
    '/',
    authDelay,
    validate(registerUser.validationScheme),
    registerUser,
  );
  
  router.get(
    '/',
    requireAuthentication,
    validate(getAllGebruikers.validationScheme),
    getAllGebruikers,
  );
  router.get(
    '/:id',
    requireAuthentication,
    validate(getUserById.validationScheme),
    checkUserId,
    getUserById,
  );
  router.put(
    '/:id',
    requireAuthentication,
    validate(updateUserById.validationScheme),
    checkUserId,
    updateUserById,
  );
  router.delete(
    '/:id',
    requireAuthentication,
    validate(deleteUserById.validationScheme),
    checkUserId,
    deleteUserById,
  );

  parent
    .use(router.routes())
    .use(router.allowedMethods());
};
