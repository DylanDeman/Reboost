import Router from '@koa/router';
import * as GebruikerService from '../service/gebruiker';
import type { ReboostContext, ReboostState} from '../types/koa';
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

const getAllGebruikers = async (ctx: KoaContext<GetAllGebruikersResponse>) => {
  const Gebruikers = await GebruikerService.getAll();
  ctx.body = { items: Gebruikers };
};
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

const getGebruikerById = async (ctx: KoaContext<GetGebruikerByIdResponse, IdParams>) => {
  const Gebruiker = await GebruikerService.getById(Number(ctx.params.id));
  ctx.status = 200;
  ctx.body = Gebruiker;
};

const updateGebruikerById = async (ctx: KoaContext<UpdateGebruikerResponse, IdParams, UpdateGebruikerRequest>) => {
  const Gebruiker = await GebruikerService.updateById(Number(ctx.params.id), ctx.request.body);
  ctx.status = 200;
  ctx.body = Gebruiker;
};

const deleteGebruikerById = async (ctx: KoaContext<void, IdParams>) => {
  await GebruikerService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

export default (parent: KoaRouter) => {
  const router = new Router<ReboostState, ReboostContext>({ prefix: '/gebruikers' });

  router.get('/', getAllGebruikers);
  router.get('/:id', getGebruikerById);
  router.post('/', createGebruiker);
  router.put('/:id', updateGebruikerById);
  router.delete('/:id', deleteGebruikerById);

  parent
    .use(router.routes())
    .use(router.allowedMethods());
};
