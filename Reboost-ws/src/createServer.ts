// src/createServer.ts
import Koa from 'koa';

import { getLogger } from './core/logging';
import { initializeData, shutdownData } from './data';
import installMiddlewares from './core/installMiddlewares';
import installRest from './rest';
import type {
  KoaApplication,
  ReboostContext,
  ReboostState,
} from './types/koa'; 

export interface Server {
  getApp(): KoaApplication;
  start(): Promise<void>;
  stop(): Promise<void>;
}

export default async function createServer(): Promise<Server> {
  const app = new Koa<ReboostState, ReboostContext>();

  installMiddlewares(app);
  await initializeData();
  installRest(app);

  return {
    getApp() {
      return app;
    },

    start() {
      return new Promise<void>((resolve) => {
        app.listen(9000, () => {
          getLogger().info('🚀 Server listening on http://localhost:9000');
          resolve();
        });
      });
    },

    async stop() {
      app.removeAllListeners();
      await shutdownData();
      getLogger().info('Dag! 👋');
    },
  };
}
