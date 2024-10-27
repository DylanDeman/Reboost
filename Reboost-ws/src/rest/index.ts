import Router from '@koa/router';
import installEvenementenRouter from './evenement';
import installHealthRouter from './health';
import installPlaatsenRoutes from './plaats';
import installGebruikerRoutes from './gebruiker';
import type { ReboostContext, ReboostState, KoaApplication } from '../types/koa';

export default (app: KoaApplication) => {
  const router = new Router<ReboostState, ReboostContext>({
    prefix: '/api',
  });

  installEvenementenRouter(router);
  installHealthRouter(router);
  installPlaatsenRoutes(router);
  installGebruikerRoutes(router);

  app.use(router.routes())
    .use(router.allowedMethods());
};
