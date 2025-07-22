import type { Next } from 'koa';
import config from 'config';
import type { KoaContext } from '../types/koa';
import * as gebruikerService from '../service/gebruiker';

const AUTH_MAX_DELAY = config.get<number>('auth.maxDelay');

export const requireAuthentication = async (ctx: KoaContext, next: Next) => {
  const { authorization } = ctx.headers;

  ctx.state.session = await gebruikerService.checkAndParseSession(authorization);

  return next();
};

export const makeRequireRoles = (requiredRoles: string[]) => async (ctx: KoaContext, next: Next) => {
  const { roles = [] } = ctx.state.session;

  gebruikerService.checkRole(requiredRoles, roles);

  return next();
};

export const authDelay = async (_: KoaContext, next: Next) => {
  await new Promise((resolve) => {
    const delay = Math.round(Math.random() * AUTH_MAX_DELAY);
    setTimeout(resolve, delay);
  });
  return next();
};
