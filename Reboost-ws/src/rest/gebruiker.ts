import Router from '@koa/router';
import * as GebruikerService from '../service/gebruiker';
import type { ReboostContext, ReboostState} from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  CreateGebruikerRequest,
  CreateGebruikerResponse,
  GetAllGebruikersResponse,
  GetGebruikerByIdResponse,
  UpdateGebruikerRequest,
  UpdateGebruikerResponse,
} from '../types/gebruiker';
import type { IdParams } from '../types/common';

const getAllGebruikers = async (ctx: KoaContext<GetAllGebruikersResponse>) => {
  const Gebruikers = await GebruikerService.getAll();
  ctx.body = { items: Gebruikers };
};

const createGebruiker = async (ctx: KoaContext<CreateGebruikerResponse, void, CreateGebruikerRequest>) => {
  const Gebruiker = await GebruikerService.create(ctx.request.body);
  ctx.status = 200;
  ctx.body = Gebruiker; 
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
