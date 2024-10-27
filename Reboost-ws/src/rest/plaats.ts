import Router from '@koa/router';
import * as PlaatsService from '../service/plaats';
import * as EvenementenService from '../service/evenement';
import type { ReboostContext, ReboostState} from '../types/koa';
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

const getAllPlaatsen = async (ctx: KoaContext<GetAllPlaatsResponse>) => {
  const Plaats = await PlaatsService.getAll();
  ctx.body = {
    items: Plaats,
  };
};

const getPlaatsById = async (ctx: KoaContext<GetPlaatsByIdResponse, IdParams>) => {
  const Plaats = await PlaatsService.getById(Number(ctx.params.id));
  ctx.body = Plaats;
};

const createPlaats = async (ctx: KoaContext<CreatePlaatsResponse, void, CreatePlaatsRequest>) => {
  const Plaats = await PlaatsService.create(ctx.request.body);
  ctx.status = 201;
  ctx.body = Plaats;
};

const updatePlaats = async (ctx: KoaContext<UpdatePlaatsResponse, IdParams, UpdatePlaatsRequest>) => {
  const Plaats = await PlaatsService.updateById(Number(ctx.params.id), ctx.request.body);
  ctx.body = Plaats;
};

const deletePlaats = async (ctx: KoaContext<void, IdParams>) => {
  await PlaatsService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

const getEvenementsByPlaatsId = async (ctx: KoaContext<GetAllEvenementenReponse, IdParams>) => {
  const evenementen = await EvenementenService.getEvenementenByPlaceId(Number(ctx.params.id));
  ctx.body = {
    items: evenementen,
  };
};

export default (parent: KoaRouter) => {
  const router = new Router<ReboostState, ReboostContext>({
    prefix: '/Plaatss',
  });

  router.get('/', getAllPlaatsen);
  router.get('/:id', getPlaatsById);
  router.post('/', createPlaats);
  router.put('/:id', updatePlaats);
  router.delete('/:id', deletePlaats);

  router.get('/:id/transactions', getEvenementsByPlaatsId);

  parent.use(router.routes())
    .use(router.allowedMethods());
};
