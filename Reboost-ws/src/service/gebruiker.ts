import jwt from 'jsonwebtoken';
import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import { hashPassword, verifyPassword } from '../core/password';
import { generateJWT, verifyJWT } from '../core/jwt';
import { getLogger } from '../core/logging';
import type { Gebruiker, GebruikerCreateInput, GebruikerUpdateInput, PublicGebruiker } from '../types/gebruiker';
import type { SessionInfo } from '../types/auth';
import handleDBError from './_handleDBError';

const makeExposedUser = (
  { 
    id, naam, roles }
  : Gebruiker): PublicGebruiker => ({
  id,
  naam,
  roles,
});

export const checkAndParseSession = async (
  authHeader?: string,
): Promise<SessionInfo> => {
  if (!authHeader) {
    throw ServiceError.unauthorized('Je Moet Ingelogd Zijn');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw ServiceError.unauthorized('Ongeldig authenticatietoken');
  }

  const authToken = authHeader.substring(7);

  try {
    const { roles, sub } = await verifyJWT(authToken);

    return {
      gebruikersId: Number(sub),
      roles,
    };
  } catch (error: any) {
    getLogger().error(error.message, { error });

    if (error instanceof jwt.TokenExpiredError) {
      throw ServiceError.unauthorized('Het token is verlopen');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw ServiceError.unauthorized(
        `Ongeldig authenticatietoken: ${error.message}`,
      );
    } else {
      throw ServiceError.unauthorized(error.message);
    }
  }
};

export const checkRole = (requiredRoles: string[], rolesUser: string[]): void => {
  // Check if any of the required roles are present in the user's roles
  const hasPermission = requiredRoles.some((role) => rolesUser.includes(role));

  if (!hasPermission) {
    throw ServiceError.forbidden(
      'Je bent niet toegestaan om dit deel van de applicatie te bekijken',
    );
  }
};

export const login = async (
  naam: string,
  wachtwoord: string,
): Promise<string> => {
  const gebruiker = await prisma.gebruiker.findUnique({ where: { naam } });

  if (!gebruiker) {
    throw ServiceError.unauthorized(
      'De gegeven gebruikersnaam en wachtwoord komen niet overeen',
    );
  }

  const wachtwoordValid = await verifyPassword(wachtwoord, gebruiker.wachtwoord);

  if (!wachtwoordValid) {
    throw ServiceError.unauthorized(
      'De gegeven gebruikersnaam en wachtwoord komen niet overeen',
    );
  }

  return await generateJWT(gebruiker);
};

export const register = async ({
  naam,
  wachtwoord,
  roles,

}: GebruikerCreateInput): Promise<string> => {
  try {
    const wachtwoordHash = await hashPassword(wachtwoord);

    const user = await prisma.gebruiker.create({
      data: {
        naam,
        wachtwoord: wachtwoordHash,
        roles: roles || [],
      },
    });

    return await generateJWT(user);
  } catch (error) {
    throw handleDBError(error);
  }
};

export const getAll = async (): Promise<PublicGebruiker[]> => {
  const users = await prisma.gebruiker.findMany();
  return users.map(makeExposedUser);
};

export const getById = async (id: number): Promise<PublicGebruiker> => {
  const gebruiker = await prisma.gebruiker.findUnique({ where: { id } });
  console.log('Fetched user roles:', gebruiker?.roles);
  if (!gebruiker) {
    throw ServiceError.notFound('Er bestaat geen gebruiker met dit id');
  }

  return makeExposedUser(gebruiker);
};

export const updateById = async (id: number, changes: GebruikerUpdateInput): Promise<PublicGebruiker> => {
  try {
    const dataToUpdate: any = { ...changes };

    if (changes.wachtwoord) {
      dataToUpdate.wachtwoord = await hashPassword(changes.wachtwoord);
    } else {
      delete dataToUpdate.wachtwoord;
    }

    // If roles is undefined, do not update roles
    if (typeof changes.roles === 'undefined') {
      delete dataToUpdate.roles;
    }

    const user = await prisma.gebruiker.update({
      where: { id },
      data: dataToUpdate,
    });
    return makeExposedUser(user);
  } catch (error) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number, rolesUser: string[]): Promise<void> => {

  if (!rolesUser.includes('admin')) {
    throw ServiceError.forbidden('Je hebt geen toestemming om gebruikers te verwijderen');
  }

  try {
    await prisma.gebruiker.delete({ where: { id } });
  } catch (error) {
    throw handleDBError(error);
  }
};

