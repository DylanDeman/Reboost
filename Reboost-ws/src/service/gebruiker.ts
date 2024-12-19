import { prisma } from '../data';
import type { CreateGebruikerResponse, Gebruiker, GebruikerUpdateInput } from '../types/gebruiker';
import { hashPassword, verifyPassword } from '../core/password';
import { generateJWT } from '../core/jwt';
import handleDBError from './_handleDBError';
import ServiceError from '../core/serviceError';

/**
 * @api {post} /sessions Login Gebruiker
 * @apiName LoginGebruiker
 * @apiGroup Gebruikers
 * @apiParam {String} naam Gebruikersnaam van de gebruiker.
 * @apiParam {String} wachtwoord Wachtwoord van de gebruiker.
 * @apiSuccess {String} token JWT token voor de ingelogde gebruiker.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "token": "JWT_TOKEN_HERE"
 *    }
 * @apiError (401) Unauthorized Gebruikersnaam of wachtwoord komt niet overeen.
 */
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

/**
 * @api {post} /gebruikers Register Gebruiker
 * @apiName RegisterGebruiker
 * @apiGroup Gebruikers
 * @apiParam {String} naam Gebruikersnaam van de nieuwe gebruiker.
 * @apiParam {String} wachtwoord Wachtwoord van de nieuwe gebruiker.
 * @apiSuccess {String} token JWT token voor de geregistreerde gebruiker.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 201 Created
 *    {
 *      "token": "JWT_TOKEN_HERE"
 *    }
 * @apiError (500) InternalServerError Er is een onverwachte fout opgetreden bij het registreren van de gebruiker.
 */
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
        'Er is een onverwachte fout opgetreden bij het registreren van de gebruiker',
      );
    }
    return await generateJWT(gebruiker);
  } catch (error: any) {
    throw handleDBError(error);
  }
};

/**
 * @api {get} /gebruikers Get All Gebruikers
 * @apiName GetAllGebruikers
 * @apiGroup Gebruikers
 * @apiSuccess {Object[]} items Lijst van gebruikers.
 * @apiSuccess {Number} items.id Gebruiker ID.
 * @apiSuccess {String} items.naam Naam van de gebruiker.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "items": [
 *        {
 *          "id": 1,
 *          "naam": "Jan"
 *        },
 *        {
 *          "id": 2,
 *          "naam": "Piet"
 *        }
 *      ]
 *    }
 * @apiError (500) InternalServerError Fout bij het ophalen van gebruikers.
 */
export const getAll = async (): Promise<Gebruiker[]> => {
  return prisma.gebruiker.findMany();
};

/**
 * @api {get} /gebruikers/:id Get Gebruiker by ID
 * @apiName GetGebruikerById
 * @apiGroup Gebruikers
 * @apiParam {Number} id Gebruiker ID.
 * @apiSuccess {Number} id Gebruiker ID.
 * @apiSuccess {String} naam Naam van de gebruiker.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "naam": "Jan"
 *    }
 * @apiError (404) NotFound Geen gebruiker gevonden met de opgegeven ID.
 */
export const getById = async (id: number): Promise<Gebruiker> => {
  const gebruiker = await prisma.gebruiker.findUnique({ where: { id } });

  if (!gebruiker) {
    throw new Error('Er bestaat geen gebruiker met dit Id');
  }

  return gebruiker;
};

/**
 * @api {put} /gebruikers/:id Update Gebruiker
 * @apiName UpdateGebruiker
 * @apiGroup Gebruikers
 * @apiParam {Number} id Gebruiker ID.
 * @apiParam {String} naam Naam van de gebruiker.
 * @apiSuccess {Number} id Gebruiker ID.
 * @apiSuccess {String} naam Naam van de gebruiker.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "naam": "Jan Updated"
 *    }
 * @apiError (404) NotFound Gebruiker niet gevonden met de opgegeven ID.
 * @apiError (500) InternalServerError Fout bij het bijwerken van de gebruiker.
 */
export const updateById = async (id: number, { naam }: GebruikerUpdateInput): Promise<Gebruiker> => {
  return prisma.gebruiker.update({
    where: { id },
    data: { naam },
  });
};

/**
 * @api {delete} /gebruikers/:id Delete Gebruiker
 * @apiName DeleteGebruiker
 * @apiGroup Gebruikers
 * @apiParam {Number} id Gebruiker ID.
 * @apiSuccess {String} message Bevestiging dat de gebruiker succesvol is verwijderd.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 204 No Content
 * @apiError (404) NotFound Gebruiker niet gevonden met de opgegeven ID.
 * @apiError (500) InternalServerError Fout bij het verwijderen van de gebruiker.
 */
export const deleteById = async (id: number): Promise<void> => {
  await prisma.gebruiker.delete({ where: { id } });
};
