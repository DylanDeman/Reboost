import { prisma } from '../data';
import type { Plaats, PlaatsCreateInput, PlaatsUpdateInput } from '../types/plaats';

/**
 * @api {get} /plaatsen Get All Plaatsen
 * @apiName GetAllPlaatsen
 * @apiGroup Plaatsen
 * @apiSuccess {Object[]} items Lijst van plaatsen.
 * @apiSuccess {Number} items.id Plaats ID.
 * @apiSuccess {String} items.naam Naam van de plaats.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "items": [
 *        {
 *          "id": 1,
 *          "naam": "Dendermonde"
 *        },
 *        {
 *          "id": 2,
 *          "naam": "Dendermonde"
 *        }
 *      ]
 *    }
 * @apiError (500) InternalServerError Fout bij het ophalen van plaatsen.
 */
export const getAll = async (): Promise<(Plaats & { _count: { evenementen: number } })[]> => {
  return prisma.plaats.findMany({
    include: {
      _count: {
        select: { evenementen: true },
      },
    },
  });
};

/**
 * @api {get} /plaatsen/:id Get Plaats by ID
 * @apiName GetPlaatsById
 * @apiGroup Plaatsen
 * @apiParam {Number} id Plaats ID.
 * @apiSuccess {Number} id Plaats ID.
 * @apiSuccess {String} naam Naam van de plaats.
 * @apiSuccess {Object[]} evenementen Lijst van evenementen gekoppeld aan de plaats.
 * @apiSuccess {Number} evenementen.id Evenement ID.
 * @apiSuccess {String} evenementen.naam Naam van het evenement.
 * @apiSuccess {Date} evenementen.datum Datum van het evenement.
 * @apiSuccess {Object} evenementen.auteur Auteur van het evenement.
 * @apiSuccess {Number} evenementen.auteur.id Auteur ID.
 * @apiSuccess {String} evenementen.auteur.naam Auteur naam.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "naam": "Dendermonde",
 *      "evenementen": [
 *        {
 *          "id": 101,
 *          "naam": "Festival",
 *          "datum": "2024-05-01T00:00:00Z",
 *          "auteur": {
 *            "id": 1,
 *            "naam": "Jan"
 *          }
 *        },
 *        {
 *          "id": 102,
 *          "naam": "Concert",
 *          "datum": "2024-06-15T00:00:00Z",
 *          "auteur": {
 *            "id": 2,
 *            "naam": "Piet"
 *          }
 *        }
 *      ]
 *    }
 * @apiError (404) NotFound Plaats niet gevonden met de opgegeven ID.
 * @apiError (500) InternalServerError Fout bij het ophalen van de plaats.
 */
export const getById = async (id: number): Promise<Plaats> => {
  const plaats = await prisma.plaats.findUnique({
    where: {
      id,
    }, 
    include: {
      evenementen: {
        select: {
          id: true,
          naam: true,
          datum: true,
          auteur: true,
        },
      },
    },
  });

  if (!plaats) {
    throw new Error('Er bestaat geen plaats met dit id');
  }

  return plaats;
};

/**
 * @api {post} /plaatsen Create Plaats
 * @apiName CreatePlaats
 * @apiGroup Plaatsen
 * @apiParam {String} naam Naam van de plaats.
 * @apiSuccess {Number} id ID van de nieuw aangemaakte plaats.
 * @apiSuccess {String} naam Naam van de nieuw aangemaakte plaats.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 201 Created
 *    {
 *      "id": 3,
 *      "naam": "Dendermonde"
 *    }
 * @apiError (500) InternalServerError Fout bij het aanmaken van de plaats.
 */
export const create = async (plaats: PlaatsCreateInput): Promise<Plaats> => {
  return prisma.plaats.create({
    data: plaats,
  });
};

/**
 * @api {put} /plaatsen/:id Update Plaats
 * @apiName UpdatePlaats
 * @apiGroup Plaatsen
 * @apiParam {Number} id Plaats ID.
 * @apiParam {String} naam Naam van de plaats.
 * @apiSuccess {Number} id ID van de bijgewerkte plaats.
 * @apiSuccess {String} naam Naam van de bijgewerkte plaats.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "naam": "Dendermonde Updated"
 *    }
 * @apiError (404) NotFound Plaats niet gevonden met de opgegeven ID.
 * @apiError (500) InternalServerError Fout bij het bijwerken van de plaats.
 */
export const updateById = async (id: number, changes: PlaatsUpdateInput): Promise<Plaats> => {
  return prisma.plaats.update({
    where: {
      id,
    },
    data: changes,
  });
};

/**
 * @api {delete} /plaatsen/:id Delete Plaats
 * @apiName DeletePlaats
 * @apiGroup Plaatsen
 * @apiParam {Number} id Plaats ID.
 * @apiSuccess {String} message Bevestiging dat de plaats succesvol is verwijderd.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 204 No Content
 * @apiError (404) NotFound Plaats niet gevonden met de opgegeven ID.
 * @apiError (500) InternalServerError Fout bij het verwijderen van de plaats.
 */
export const deleteById = async (id: number) => {
  await prisma.plaats.delete({
    where: {
      id,
    },
  });
};
