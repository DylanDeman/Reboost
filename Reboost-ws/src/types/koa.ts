import type { ParameterizedContext } from 'koa';
import type Application from 'koa';
import type Router from '@koa/router';
import type { SessionInfo } from './auth';

export interface ReboostState {
  gebruiker: any;
  session: SessionInfo;
}

export interface ReboostContext<
  Params = unknown,
  RequestBody = unknown,
  Query = unknown,
> {
  request: {
    body: RequestBody;
    query: Query;
  };
  params: Params;
}

export type KoaContext<
  ResponseBody = unknown,
  Params = unknown,
  RequestBody = unknown,
  Query = unknown,
> =
  ParameterizedContext<
    ReboostState,
    ReboostContext<Params, RequestBody, Query>,
    ResponseBody
  >;

export interface KoaApplication extends Application<ReboostState, ReboostContext> {}

export interface KoaRouter extends Router<ReboostState, ReboostContext> {}
