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
import { authDelay, makeRequireRoles, requireAuthentication } from '../core/auth';

const checkUserId = (ctx: KoaContext<any, { id: string | number }>, next: Next) => {
  const { gebruikersId, roles } = ctx.state.session;
  const { id } = ctx.params;

  const isAdmin = Array.isArray(roles) && roles.includes('admin');

  // Allow if:
  // - id param is 'me'
  // - OR id param matches the logged in user's id (as number or string)
  // - OR user is admin
  if (id !== 'me' && Number(id) !== gebruikersId && !isAdmin) {
    return ctx.throw(
      403,
      'Je hebt geen toegang tot deze gebruiker',
      { code: 'FORBIDDEN' },
    );
  }

  return next();
};

/**
 * @api {get} /gebruikers Get all gebruikers
 * @apiName GetAllGebruikers
 * @apiGroup Gebruiker
 * @apiPermission authenticated
 *
 * @apiSuccess {Object[]} items List of gebruikers
 * @apiSuccess {Number} items.id User ID
 * @apiSuccess {String} items.naam User name
 * @apiSuccess {String[]} items.roles Roles assigned to user
 */
const getAllGebruikers = async (ctx: KoaContext<GetAllGebruikersResponse>) => {
  const users = await GebruikerService.getAll();
  ctx.body = { items: users };
};
getAllGebruikers.validationScheme = null;

/**
 * @api {post} /gebruikers Register a new gebruiker
 * @apiName RegisterUser
 * @apiGroup Gebruiker
 * @apiPermission none
 *
 * @apiBody {String{..255}} naam Name of the user
 * @apiBody {String{12..255}} wachtwoord Password for the user (min length 12)
 * @apiBody {String[]} [roles] Roles for the user
 *
 * @apiSuccess {String} token Authentication token for the new user
 */
const registerUser = async (ctx: KoaContext<LoginResponse, void, RegisterGebruikerRequest>) => {
  const token = await GebruikerService.register(ctx.request.body);
  ctx.status = 200;
  ctx.body = { token };
};
registerUser.validationScheme = {
  body: {
    naam: Joi.string().max(255).required(),
    wachtwoord: Joi.string().min(8).max(255).required(),
    roles: Joi.array().items(Joi.string()).default([]).optional(),
  },
};

/**
 * @api {get} /gebruikers/:id Get gebruiker by id
 * @apiName GetGebruikerById
 * @apiGroup Gebruiker
 * @apiPermission authenticated
 *
 * @apiParam {Number/String} id User's unique ID or 'me' for current user
 *
 * @apiSuccess {Number} id User ID
 * @apiSuccess {String} naam User name
 * @apiSuccess {String[]} roles Roles assigned to user
 */
const getUserById = async (ctx: KoaContext<GetGebruikerByIdResponse, GetGebruikerRequest>) => {
  const user = await GebruikerService.getById(
    ctx.params.id === 'me' ? ctx.state.session.gebruikersId : ctx.params.id,
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

/**
 * @api {put} /gebruikers/:id Update gebruiker by id
 * @apiName UpdateGebruikerById
 * @apiGroup Gebruiker
 * @apiPermission authenticated
 *
 * @apiParam {Number} id User's unique ID
 *
 * @apiBody {String} [naam] Name of the user
 * @apiBody {String[]} [roles] Roles assigned to the user
 * @apiBody {String{12..255}} [wachtwoord] Password for the user (min length 12)
 *
 * @apiSuccess {Number} id User ID
 * @apiSuccess {String} naam Updated user name
 * @apiSuccess {String[]} roles Updated roles
 */
const updateUserById = async (ctx: KoaContext<UpdateGebruikerResponse, IdParams, UpdateGebruikerRequest>) => {
  const user = await GebruikerService.updateById(ctx.params.id, ctx.request.body);
  ctx.status = 200;
  ctx.body = user;
};
updateUserById.validationScheme = {
  params: { id: Joi.number().integer().positive() },
  body: {
    naam: Joi.string().max(255).optional(),
    roles: Joi.array().items(Joi.string()).optional(),
    wachtwoord: Joi.string().min(8).max(255).optional(),
  },
};

/**
 * @api {delete} /gebruikers/:id Delete gebruiker by id
 * @apiName DeleteGebruikerById
 * @apiGroup Gebruiker
 * @apiPermission authenticated
 *
 * @apiParam {Number} id User's unique ID
 *
 * @apiSuccess (204) No Content User successfully deleted
 */
const deleteUserById = async (ctx: KoaContext<void, IdParams>) => {
  await GebruikerService.deleteById(ctx.params.id, ctx.state.session.roles);
  ctx.status = 204;
};
deleteUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default function installUserRoutes(parent: KoaRouter) {
  const router = new Router<ReboostState, ReboostContext>({ prefix: '/gebruikers' });

  const requireAdmin = makeRequireRoles(['admin']);

  router.post(
    '/',
    authDelay,
    requireAdmin,
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
    requireAuthentication, // Use general authentication first
    checkUserId,
    requireAdmin, // only admin can update other users
    validate(updateUserById.validationScheme),
    updateUserById,
  );
  router.delete(
    '/:id',
    requireAuthentication,
    checkUserId,
    requireAdmin,
    validate(deleteUserById.validationScheme),
    deleteUserById,
  );

  parent
    .use(router.routes())
    .use(router.allowedMethods());
}
