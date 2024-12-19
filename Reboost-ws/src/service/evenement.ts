import { prisma } from '../data';
import type { Evenement, EvenementCreateInput, EvenementUpdateInput } from '../types/evenement';
import * as plaatsService from './plaats';
import handleDBError from './_handleDBError';
import ServiceError from '../core/serviceError';

const Evenement_SELECT = {
  id: true,
  naam: true,
  datum: true,
  plaats: true,
  auteur: {
    select: {
      id: true,
      naam: true,
    },
  },
};

/**
 * @api {get} /evenementen Get All Evenementen
 * @apiName GetAllEvenementen
 * @apiGroup Evenementen
 * @apiSuccess {Object[]} items Lijst van evenementen.
 * @apiSuccess {Number} items.id Evenement ID.
 * @apiSuccess {String} items.naam Naam van het evenement.
 * @apiSuccess {String} items.datum Datum van het evenement.
 * @apiSuccess {Object} items.plaats Plaats van het evenement.
 * @apiSuccess {Object} items.auteur Auteur van het evenement.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "items": [
 *        {
 *          "id": 1,
 *          "naam": "Concert",
 *          "datum": "2024-05-01T20:00:00.000Z",
 *          "plaats": { "id": 1, "naam": "Zaal A" },
 *          "auteur": { "id": 1, "naam": "John Doe" }
 *        }
 *      ]
 *    }
 * @apiError (500) InternalServerError Fout bij het ophalen van evenementen.
 */
export const getAll = async (): Promise<Evenement[]> => {
  return prisma.evenement.findMany({
    select: Evenement_SELECT,
  });
};

/**
 * @api {get} /evenementen/:id Get Evenement by ID
 * @apiName GetEvenementById
 * @apiGroup Evenementen
 * @apiParam {Number} id Evenement ID.
 * @apiSuccess {Number} id Evenement ID.
 * @apiSuccess {String} naam Naam van het evenement.
 * @apiSuccess {String} datum Datum van het evenement.
 * @apiSuccess {Object} plaats Plaats van het evenement.
 * @apiSuccess {Object} auteur Auteur van het evenement.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "naam": "Concert",
 *      "datum": "2024-05-01T20:00:00.000Z",
 *      "plaats": { "id": 1, "naam": "Zaal A" },
 *      "auteur": { "id": 1, "naam": "John Doe" }
 *    }
 * @apiError (404) NotFound Evenement niet gevonden met de opgegeven ID.
 */
export const getById = async (id: number): Promise<Evenement> => {
  const Evenement = await prisma.evenement.findUnique({
    where: {
      id,
    },
    select: Evenement_SELECT,
  });

  if (!Evenement) {
    throw ServiceError.notFound('Er bestaat geen evenement met dit Id');
  }

  return Evenement;
};

/**
 * @api {post} /evenementen Create Evenement
 * @apiName CreateEvenement
 * @apiGroup Evenementen
 * @apiParam {String} naam Naam van het evenement.
 * @apiParam {Date} datum Datum van het evenement.
 * @apiParam {Number} plaats_id ID van de plaats waar het evenement plaatsvindt.
 * @apiParam {Number} auteur_id ID van de auteur van het evenement.
 * @apiSuccess {Number} id ID van het nieuw aangemaakte evenement.
 * @apiSuccess {String} naam Naam van het evenement.
 * @apiSuccess {String} datum Datum van het evenement.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 201 Created
 *    {
 *      "id": 2,
 *      "naam": "Nieuw Evenement",
 *      "datum": "2024-06-15T18:00:00.000Z"
 *    }
 * @apiError (400) BadRequest Fout bij het creëren van evenement, invalid gegevens.
 * @apiError (500) InternalServerError Fout bij het aanmaken van evenement.
 */
export const create = async ({
  naam,
  datum,
  plaats_id,
  auteur_id,
}: EvenementCreateInput): Promise<Evenement> => {
  try {
    await plaatsService.getById(plaats_id);

    return await prisma.evenement.create({
      data: {
        naam: naam,
        datum: datum,
        auteur_id: auteur_id,
        plaats_id: plaats_id,
      },
      select: Evenement_SELECT,
    });
  } catch (error: any) {
    throw handleDBError(error);
  }
};

/**
 * @api {put} /evenementen/:id Update Evenement
 * @apiName UpdateEvenement
 * @apiGroup Evenementen
 * @apiParam {Number} id Evenement ID.
 * @apiParam {String} naam Naam van het evenement.
 * @apiParam {Date} datum Datum van het evenement.
 * @apiParam {Number} plaats_id ID van de plaats waar het evenement plaatsvindt.
 * @apiParam {Number} auteur_id ID van de auteur van het evenement.
 * @apiSuccess {Number} id ID van het bijgewerkte evenement.
 * @apiSuccess {String} naam Naam van het evenement.
 * @apiSuccess {String} datum Datum van het evenement.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "naam": "Updated Evenement",
 *      "datum": "2024-06-15T18:00:00.000Z"
 *    }
 * @apiError (404) NotFound Evenement niet gevonden met de opgegeven ID.
 * @apiError (400) BadRequest Ongeldige gegevens bij het bijwerken van evenement.
 * @apiError (500) InternalServerError Fout bij het bijwerken van evenement.
 */
export const updateById = async (id: number, {
  naam,
  datum,
  plaats_id,
  auteur_id,
}: EvenementUpdateInput): Promise<Evenement> => {
  try {
    await plaatsService.getById(plaats_id);

    return await prisma.evenement.update({
      where: {
        id: id,
      },
      data: {
        naam: naam,
        datum: datum,
        auteur_id: auteur_id,
        plaats_id: plaats_id,
      },
      select: Evenement_SELECT,
    });
  } catch (error: any) {
    throw handleDBError(error);
  }
};

/**
 * @api {delete} /evenementen/:id Delete Evenement
 * @apiName DeleteEvenement
 * @apiGroup Evenementen
 * @apiParam {Number} id Evenement ID.
 * @apiSuccess {String} message Bevestiging dat het evenement succesvol is verwijderd.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 204 No Content
 * @apiError (404) NotFound Evenement niet gevonden met de opgegeven ID.
 * @apiError (500) InternalServerError Fout bij het verwijderen van evenement.
 */
export const deleteById = async (id: number): Promise<void> => {
  await prisma.evenement.delete({
    where: {
      id,
    },
  });
};

/**
 * @api {get} /plaatsen/:id/evenementen Get Evenementen per Plaats
 * @apiName GetEvenementenByPlaceId
 * @apiGroup Evenementen
 * @apiParam {Number} plaats_id ID van de plaats.
 * @apiSuccess {Object[]} items Lijst van evenementen op de opgegeven plaats.
 * @apiSuccess {Number} items.id Evenement ID.
 * @apiSuccess {String} items.naam Naam van het evenement.
 * @apiSuccess {String} items.datum Datum van het evenement.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "items": [
 *        {
 *          "id": 1,
 *          "naam": "Festival",
 *          "datum": "2024-07-01T20:00:00.000Z"
 *        }
 *      ]
 *    }
 * @apiError (404) NotFound Geen evenementen gevonden voor deze plaats.
 */
export const getEvenementenByPlaceId = async (plaats_id: number): Promise<Evenement[]> => {
  return prisma.evenement.findMany({
    where: {
      AND: [
        { plaats_id: plaats_id },
      ],
    },
    select: Evenement_SELECT,
  });
};
