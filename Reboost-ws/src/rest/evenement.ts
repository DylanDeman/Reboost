import Router from '@koa/router';
import * as EvenementService from '../service/evenement';
import type { ReboostContext, ReboostState } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  CreateEvenementRequest,
  CreateEvenementResponse,
  GetAllEvenementenReponse,
  GetEvenementByIdResponse,
  UpdateEvenementRequest,
  UpdateEvenementResponse,
} from '../types/evenement';
import type { IdParams } from '../types/common';

const getAllEvenementen = async (ctx: KoaContext<GetAllEvenementenReponse>) => {
  ctx.body = {
    items: await EvenementService.getAll(),
  };
};

const createEvenement = async (ctx: KoaContext<CreateEvenementResponse, void, CreateEvenementRequest>) => {
  const newEvenement = await EvenementService.create({
    ...ctx.request.body,
    plaats_id: Number(ctx.request.body.plaats_id),
    auteur_id: Number(ctx.request.body.auteur_id),
    datum: new Date(ctx.request.body.datum),
  });
  ctx.body = newEvenement;
};

const getEvenementById = async (ctx: KoaContext<GetEvenementByIdResponse, IdParams>) => {
  ctx.body = await EvenementService.getById(Number(ctx.params.id));
};

const updateEvenement = async (ctx: KoaContext<UpdateEvenementResponse, IdParams, UpdateEvenementRequest>) => {
  ctx.body = await EvenementService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    plaats_id: Number(ctx.request.body.plaats_id),
    auteur_id: Number(ctx.request.body.auteur_id),
    datum: new Date(ctx.request.body.datum),
    
  });
  console.log(ctx.body);
};

const deleteEvenement = async (ctx: KoaContext<void, IdParams>) => {
  await EvenementService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

export default (parent: KoaRouter) => {
  const router = new Router<ReboostState, ReboostContext>({
    prefix: '/evenementen',
  });

  router.get('/', getAllEvenementen);
  router.post('/', createEvenement);
  router.get('/:id', getEvenementById);
  router.put('/:id', updateEvenement);
  router.delete('/:id', deleteEvenement);

  parent.use(router.routes())
    .use(router.allowedMethods());
};
