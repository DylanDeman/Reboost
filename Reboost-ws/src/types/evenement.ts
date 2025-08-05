import type { Gebruiker } from '@prisma/client';
import type { Entity, ListResponse } from './common';
import type { Plaats } from './plaats';
import type { Gereedschap } from './gereedschap';

/**
 * @apiDefine Evenement Evenement Object
 * @apiSuccess {Number} id Evenement ID.
 * @apiSuccess {String} naam Naam van het evenement.
 * @apiSuccess {Date} datum Datum van het evenement.
 * @apiSuccess {Object} auteur Auteur van het evenement (gebruiker).
 * @apiSuccess {Number} auteur.id Auteur ID.
 * @apiSuccess {String} auteur.naam Auteur naam.
 * @apiSuccess {Object} plaats Plaats waar het evenement plaatsvindt.
 * @apiSuccess {Number} plaats.id Plaats ID.
 */

/**
 * @api {post} /evenementen Create Evenement
 * @apiName CreateEvenement
 * @apiGroup Evenementen
 * @apiParam {String} naam Naam van het evenement.
 * @apiParam {Date} datum Datum van het evenement.
 * @apiParam {Number} auteur_id ID van de auteur van het evenement.
 * @apiParam {Number} plaats_id ID van de plaats waar het evenement plaatsvindt.
 * @apiSuccess {Number} id Het ID van het nieuw aangemaakte evenement.
 * @apiSuccess {String} naam Naam van het evenement.
 * @apiSuccess {Date} datum Datum van het evenement.
 * @apiSuccess {Object} auteur Auteur van het evenement.
 * @apiSuccess {Number} auteur.id Auteur ID.
 * @apiSuccess {String} auteur.naam Auteur naam.
 * @apiSuccess {Object} plaats Plaats van het evenement.
 * @apiSuccess {Number} plaats.id Plaats ID.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 201 Created
 *    {
 *      "id": 1,
 *      "naam": "Festival",
 *      "datum": "2024-05-01T00:00:00Z",
 *      "auteur": {
 *        "id": 1,
 *        "naam": "Jan"
 *      },
 *      "plaats": {
 *        "id": 1
 *      }
 *    }
 * @apiError (400) BadRequest Fout in de invoerparameters.
 * @apiError (500) InternalServerError Fout bij het aanmaken van het evenement.
 */
export interface Evenement extends Entity {
  naam: string;
  datum: Date;
  auteur: Pick<Gebruiker, 'id' | 'naam'>; // Auteur van het evenement, bevat id en naam van de gebruiker
  plaats: Pick<Plaats, 'id' | 'id'>; // Plaats van het evenement, bevat alleen het id van de plaats
  gereedschappen?: Gereedschap[];
}

/**
 * @api {put} /evenementen/:id Update Evenement
 * @apiName UpdateEvenement
 * @apiGroup Evenementen
 * @apiParam {Number} id Evenement ID dat moet worden bijgewerkt.
 * @apiParam {String} naam Naam van het evenement.
 * @apiParam {Date} datum Datum van het evenement.
 * @apiParam {Number} auteur_id ID van de auteur van het evenement.
 * @apiParam {Number} plaats_id ID van de plaats waar het evenement plaatsvindt.
 * @apiSuccess {Number} id Het ID van het bijgewerkte evenement.
 * @apiSuccess {String} naam Naam van het evenement.
 * @apiSuccess {Date} datum Datum van het evenement.
 * @apiSuccess {Object} auteur Auteur van het evenement.
 * @apiSuccess {Number} auteur.id Auteur ID.
 * @apiSuccess {String} auteur.naam Auteur naam.
 * @apiSuccess {Object} plaats Plaats van het evenement.
 * @apiSuccess {Number} plaats.id Plaats ID.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "naam": "Festival Updated",
 *      "datum": "2024-06-01T00:00:00Z",
 *      "auteur": {
 *        "id": 1,
 *        "naam": "Jan"
 *      },
 *      "plaats": {
 *        "id": 2
 *      }
 *    }
 * @apiError (404) NotFound Evenement niet gevonden met opgegeven ID.
 * @apiError (500) InternalServerError Fout bij het bijwerken van het evenement.
 */
export interface EvenementCreateInput {
  naam: string;
  datum: Date;
  auteur_id: number; // ID van de auteur
  plaats_id: number; // ID van de plaats
  gereedschap_ids?: number[];
}

/**
 * @api {get} /evenementen/:id Get Evenement by ID
 * @apiName GetEvenementById
 * @apiGroup Evenementen
 * @apiParam {Number} id Evenement ID.
 * @apiSuccess {Number} id Het ID van het evenement.
 * @apiSuccess {String} naam Naam van het evenement.
 * @apiSuccess {Date} datum Datum van het evenement.
 * @apiSuccess {Object} auteur Auteur van het evenement.
 * @apiSuccess {Number} auteur.id Auteur ID.
 * @apiSuccess {String} auteur.naam Auteur naam.
 * @apiSuccess {Object} plaats Plaats van het evenement.
 * @apiSuccess {Number} plaats.id Plaats ID.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "naam": "Festival",
 *      "datum": "2024-05-01T00:00:00Z",
 *      "auteur": {
 *        "id": 1,
 *        "naam": "Jan"
 *      },
 *      "plaats": {
 *        "id": 1
 *      }
 *    }
 * @apiError (404) NotFound Evenement niet gevonden met opgegeven ID.
 * @apiError (500) InternalServerError Fout bij het ophalen van het evenement.
 */
export interface EvenementUpdateInput extends EvenementCreateInput { }

export interface CreateEvenementRequest extends EvenementCreateInput { }

export interface UpdateEvenementRequest extends EvenementUpdateInput { }

/**
 * @api {get} /evenementen Get All Evenementen
 * @apiName GetAllEvenementen
 * @apiGroup Evenementen
 * @apiSuccess {Object[]} items Lijst van evenementen.
 * @apiSuccess {Number} items.id Evenement ID.
 * @apiSuccess {String} items.naam Naam van het evenement.
 * @apiSuccess {Date} items.datum Datum van het evenement.
 * @apiSuccess {Object} items.auteur Auteur van het evenement.
 * @apiSuccess {Number} items.auteur.id Auteur ID.
 * @apiSuccess {String} items.auteur.naam Auteur naam.
 * @apiSuccess {Object} items.plaats Plaats waar het evenement plaatsvindt.
 * @apiSuccess {Number} items.plaats.id Plaats ID.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "items": [
 *        {
 *          "id": 1,
 *          "naam": "Festival",
 *          "datum": "2024-05-01T00:00:00Z",
 *          "auteur": {
 *            "id": 1,
 *            "naam": "Jan"
 *          },
 *          "plaats": {
 *            "id": 1
 *          }
 *        },
 *        {
 *          "id": 2,
 *          "naam": "Concert",
 *          "datum": "2024-06-15T00:00:00Z",
 *          "auteur": {
 *            "id": 2,
 *            "naam": "Piet"
 *          },
 *          "plaats": {
 *            "id": 2
 *          }
 *        }
 *      ]
 *    }
 * @apiError (500) InternalServerError Fout bij het ophalen van evenementen.
 */
export interface GetAllEvenementenReponse extends ListResponse<Evenement> { }

export interface GetEvenementByIdResponse extends Evenement { }

export interface CreateEvenementResponse extends GetEvenementByIdResponse { }

export interface UpdateEvenementResponse extends GetEvenementByIdResponse { }
