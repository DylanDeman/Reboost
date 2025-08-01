import Router from '@koa/router';
import installEvenementenRouter from './evenement';
import installHealthRouter from './health';
import installPlaatsenRoutes from './plaats';
import installGebruikerRoutes from './gebruiker';
import installSessionRouter from './session';
import installGereedschapRoutes from './gereedschap';
import type { ReboostContext, ReboostState, KoaApplication } from '../types/koa';

export default (app: KoaApplication) => {
  const router = new Router<ReboostState, ReboostContext>({
    prefix: '/api',
  });

  installEvenementenRouter(router);
  installPlaatsenRoutes(router);
  installGebruikerRoutes(router);
  installGereedschapRoutes(router);
  installHealthRouter(router);
  installSessionRouter(router);

  app.use(router.routes())
    .use(router.allowedMethods());
};
