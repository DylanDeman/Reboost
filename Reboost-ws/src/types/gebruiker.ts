import type { Entity, ListResponse } from './common';
import type { Prisma } from '@prisma/client';

/**
 * @apiDefine Gebruiker Gebruiker Object
 * @apiSuccess {Number} id Gebruiker ID.
 * @apiSuccess {String} naam Naam van de gebruiker.
 * @apiSuccess {String} wachtwoord Wachtwoord van de gebruiker (gehashed).
 * @apiSuccess {Object} roles Rollen van de gebruiker in JSON-formaat.
 */

/**
 * @api {post} /sessions Login
 * @apiName Login
 * @apiGroup Gebruiker
 * @apiParam {String} naam Naam van de gebruiker.
 * @apiParam {String} wachtwoord Wachtwoord van de gebruiker.
 * @apiSuccess {String} token JWT-token voor authenticatie.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwIjoxNjg3OTg5Mzg2fQ.
 *                q8OVYtQ0S6K-WdVtv8qx07P_zEx2FvcGn2V6kFfg8gI"
 *    }
 * @apiError (401) Unauthorized Onjuiste gebruikersnaam of wachtwoord.
 */
export interface LoginRequest {
  naam: string; // Gebruikersnaam voor login
  wachtwoord: string; // Wachtwoord voor login
}

/**
 * @api {post} /sessions Login Response
 * @apiName LoginResponse
 * @apiGroup Gebruiker
 * @apiSuccess {String} token JWT-token voor authenticatie.
 */
export interface LoginResponse {
  token: string; // JWT-token
}

/**
 * @api {get} /gebruikers Get All Gebruikers
 * @apiName GetAllGebruikers
 * @apiGroup Gebruiker
 * @apiSuccess {Object[]} items Lijst van alle gebruikers.
 * @apiSuccess {Number} items.id Gebruiker ID.
 * @apiSuccess {String} items.naam Naam van de gebruiker.
 * @apiSuccess {String} items.wachtwoord Wachtwoord van de gebruiker (gehashed).
 * @apiSuccess {Object} items.roles Rollen van de gebruiker in JSON-formaat.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "items": [
 *        {
 *          "id": 1,
 *          "naam": "Jan",
 *          "wachtwoord": "$2b$12$wGzv2RziZMl59xuEKrc9Ouf0Q3d5DImN/....",
 *          "roles": ["admin", "user"]
 *        },
 *        {
 *          "id": 2,
 *          "naam": "Piet",
 *          "wachtwoord": "$2b$12$zJ1kB4VlbKJe4tUQZL8O.5lWvYkPY33L...",
 *          "roles": ["user"]
 *        }
 *      ]
 *    }
 * @apiError (500) InternalServerError Fout bij het ophalen van gebruikers.
 */
export interface Gebruiker extends Entity {
  naam: string; // Naam van de gebruiker
  wachtwoord: string; // Gehashed wachtwoord van de gebruiker
  roles: Prisma.JsonValue; // Rollen van de gebruiker in JSON-formaat
}

/**
 * @api {post} /gebruikers Create Gebruiker
 * @apiName CreateGebruiker
 * @apiGroup Gebruiker
 * @apiParam {String} naam Naam van de nieuwe gebruiker.
 * @apiParam {String} wachtwoord Wachtwoord van de nieuwe gebruiker.
 * @apiSuccess {Number} id Het ID van de nieuw aangemaakte gebruiker.
 * @apiSuccess {String} naam Naam van de nieuwe gebruiker.
 * @apiSuccess {String} wachtwoord Gehashed wachtwoord van de nieuwe gebruiker.
 * @apiSuccess {Object} roles Rollen van de nieuwe gebruiker in JSON-formaat.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 201 Created
 *    {
 *      "id": 3,
 *      "naam": "Joris",
 *      "wachtwoord": "$2b$12$zJ1kB4VlbKJe4tUQZL8O.5lWvYkPY33L...",
 *      "roles": ["user"]
 *    }
 * @apiError (400) BadRequest Onjuiste gegevens voor het aanmaken van de gebruiker.
 * @apiError (500) InternalServerError Fout bij het aanmaken van de gebruiker.
 */
export interface GebruikerCreateInput {
  naam: string; // Naam van de nieuwe gebruiker
  wachtwoord: string; // Wachtwoord van de nieuwe gebruiker
}

/**
 * @api {get} /gebruikers/:id Get Gebruiker by ID
 * @apiName GetGebruikerById
 * @apiGroup Gebruiker
 * @apiParam {Number} id Gebruiker ID.
 * @apiSuccess {Number} id Het ID van de gebruiker.
 * @apiSuccess {String} naam Naam van de gebruiker.
 * @apiSuccess {String} wachtwoord Gehashed wachtwoord van de gebruiker.
 * @apiSuccess {Object} roles Rollen van de gebruiker in JSON-formaat.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "naam": "Jan",
 *      "wachtwoord": "$2b$12$wGzv2RziZMl59xuEKrc9Ouf0Q3d5DImN/....",
 *      "roles": ["admin", "user"]
 *    }
 * @apiError (404) NotFound Gebruiker niet gevonden met opgegeven ID.
 * @apiError (500) InternalServerError Fout bij het ophalen van de gebruiker.
 */
export interface PublicGebruiker extends Pick<Gebruiker, 'id' | 'naam'> {}

/**
 * @api {put} /gebruikers/:id Update Gebruiker
 * @apiName UpdateGebruiker
 * @apiGroup Gebruiker
 * @apiParam {Number} id Gebruiker ID die moet worden bijgewerkt.
 * @apiParam {String} naam Nieuwe naam van de gebruiker.
 * @apiParam {String} wachtwoord Nieuw wachtwoord van de gebruiker (gehashed).
 * @apiSuccess {Number} id Het ID van de bijgewerkte gebruiker.
 * @apiSuccess {String} naam De bijgewerkte naam van de gebruiker.
 * @apiSuccess {String} wachtwoord Gehashed wachtwoord van de gebruiker.
 * @apiSuccess {Object} roles Rollen van de gebruiker in JSON-formaat.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "naam": "Jan Updated",
 *      "wachtwoord": "$2b$12$zJ1kB4VlbKJe4tUQZL8O.5lWvYkPY33L...",
 *      "roles": ["user"]
 *    }
 * @apiError (404) NotFound Gebruiker niet gevonden met opgegeven ID.
 * @apiError (500) InternalServerError Fout bij het bijwerken van de gebruiker.
 */
export interface GebruikerUpdateInput extends GebruikerCreateInput {}

/**
 * @api {get} /gebruikers Get All Gebruikers
 * @apiName GetAllGebruikers
 * @apiGroup Gebruiker
 * @apiSuccess {Object[]} items Lijst van alle gebruikers.
 * @apiSuccess {Number} items.id Gebruiker ID.
 * @apiSuccess {String} items.naam Naam van de gebruiker.
 * @apiSuccess {String} items.wachtwoord Wachtwoord van de gebruiker (gehashed).
 * @apiSuccess {Object} items.roles Rollen van de gebruiker in JSON-formaat.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "items": [
 *        {
 *          "id": 1,
 *          "naam": "Jan",
 *          "wachtwoord": "$2b$12$wGzv2RziZMl59xuEKrc9Ouf0Q3d5DImN/....",
 *          "roles": ["admin", "user"]
 *        },
 *        {
 *          "id": 2,
 *          "naam": "Piet",
 *          "wachtwoord": "$2b$12$zJ1kB4VlbKJe4tUQZL8O.5lWvYkPY33L...",
 *          "roles": ["user"]
 *        }
 *      ]
 *    }
 * @apiError (500) InternalServerError Fout bij het ophalen van gebruikers.
 */
export interface GetAllGebruikersResponse extends ListResponse<Gebruiker> {}

export interface GetGebruikerByIdResponse extends Gebruiker {}

export interface CreateGebruikerResponse extends GetGebruikerByIdResponse {}

export interface UpdateGebruikerResponse extends GetGebruikerByIdResponse {
  wachtwoord: string; // Gehashed wachtwoord na het bijwerken
}
