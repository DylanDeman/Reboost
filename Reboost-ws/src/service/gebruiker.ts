import { prisma } from '../data';
import type { CreateGebruikerResponse, Gebruiker, GebruikerUpdateInput }
  from '../types/gebruiker';
import type {
// PublicGebruiker, 
} from '../types/gebruiker';
import { hashPassword, verifyPassword } from '../core/password';
import { generateJWT } from '../core/jwt';
import handleDBError from './_handleDBError';
import ServiceError from '../core/serviceError';

// const maakexposedGebruiker = ({ id, naam }: Gebruiker): PublicGebruiker => ({
//   id,
//   naam,
// });

export const login = async (
  naam: string,
  wachtwoord: string,
): Promise<string> => {
  const gebruiker = await prisma.gebruiker.findUnique({ where: { naam } }); 

  if (!gebruiker) {
   
    throw ServiceError.unauthorized(
      'de gebruikersnaam en paswoord komen niet overeen',
    );
  }

  const passwordValid = await verifyPassword(wachtwoord, gebruiker.wachtwoord);

  if (!passwordValid) {

    throw ServiceError.unauthorized(
      'de gebruikersnaam en paswoord komen niet overeen',
    );
  }

  return await generateJWT(gebruiker); 
};

export const register = async ({
  naam,
  wachtwoord, 
}: CreateGebruikerResponse): Promise<string> => {
  try {
    const passwordHash = await hashPassword(wachtwoord); 
  
    const gebruiker = await prisma.gebruiker.create({
      data: {
        naam,
        wachtwoord: passwordHash,
        roles: ['user'], 
      },
    });
    if (!gebruiker) {
      throw ServiceError.internalServerError(
        'An unexpected error occured when creating the user',
      );
    }
    return await generateJWT(gebruiker);
  } catch (error:any) {
    throw handleDBError(error);
  }
};

export const getAll = async (): Promise<Gebruiker[]> => {
  return prisma.gebruiker.findMany();
};

export const getById = async (id: number): Promise<Gebruiker> => {
  const Gebruiker = await prisma.gebruiker.findUnique({ where: { id } });

  if (!Gebruiker) {
    throw new Error('Er bestaat geen gebruiker met dit Id');
  }

  return Gebruiker;
};

export const updateById = async (id: number, { naam }: GebruikerUpdateInput): Promise<Gebruiker> => {
  return prisma.gebruiker.update({
    where: { id },
    data: { naam },
  });
};
 
export const deleteById = async (id: number): Promise<void> => {
  await prisma.gebruiker.delete({ where: { id } });
};
