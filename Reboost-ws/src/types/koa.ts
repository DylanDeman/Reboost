import type { ParameterizedContext } from 'koa';
import type Application from 'koa';
import type Router from '@koa/router';

export interface ReboostState {}

export interface ReboostContext {}

export type KoaContext<
  ResponseBody = unknown,
  Params = unknown,
  RequestBody = unknown,
  Query = unknown,
> =
  ParameterizedContext<ReboostState, ReboostContext, ResponseBody>
  & {
    request: {
      body: RequestBody;
      query: Query;
    };
    params: Params;
  };

export interface KoaApplication extends Application<ReboostState, ReboostContext> {}

export interface KoaRouter extends Router<ReboostState, ReboostContext> {}
