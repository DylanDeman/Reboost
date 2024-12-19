import type { Entity, ListResponse } from './common';

/**
 * @apiDefine Plaats Plaats Object
 * @apiDescription Het `Plaats` object vertegenwoordigt een geografische locatie, inclusief adresinformatie zoals naam, straat, huisnummer, postcode en gemeente.
 * @apiExample {json} Plaats Example
 *    {
 *      "id": 1,
 *      "naam": "Amsterdam",
 *      "straat": "Damstraat",
 *      "huisnummer": "5",
 *      "postcode": "1000AB",
 *      "gemeente": "Amsterdam"
 *    }
 */
export interface Plaats extends Entity {
  /** De naam van de plaats (bijv. Amsterdam, Rotterdam) */
  naam: string;
  
  /** De straatnaam van de plaats */
  straat: string;
  
  /** Het huisnummer in de straat */
  huisnummer: string;
  
  /** De postcode van de plaats */
  postcode: string;
  
  /** De gemeente waarin de plaats zich bevindt */
  gemeente: string;
}

/**
 * @api {object} PlaatsCreateInput PlaatsCreateInput Object
 * @apiName PlaatsCreateInput
 * @apiGroup Plaats
 * @apiDescription Het `PlaatsCreateInput` object wordt gebruikt bij het aanmaken van een nieuwe plaats in de database.
 * @apiParam {string} naam De naam van de plaats (bijv. Amsterdam).
 * @apiParam {string} straat De straatnaam van de plaats (bijv. Damstraat).
 * @apiParam {string} huisnummer Het huisnummer in de straat (bijv. 5).
 * @apiParam {string} postcode De postcode van de plaats (bijv. 1000AB).
 * @apiParam {string} gemeente De gemeente waarin de plaats zich bevindt (bijv. Amsterdam).
 * @apiExample {json} PlaatsCreateInput Example
 *    {
 *      "naam": "Amsterdam",
 *      "straat": "Damstraat",
 *      "huisnummer": "5",
 *      "postcode": "1000AB",
 *      "gemeente": "Amsterdam"
 *    }
 */
export interface PlaatsCreateInput {
  naam: string;
  straat: string;
  huisnummer: string;
  postcode: string;
  gemeente: string;
}

/**
 * @api {object} PlaatsUpdateInput PlaatsUpdateInput Object
 * @apiName PlaatsUpdateInput
 * @apiGroup Plaats
 * @apiDescription Het `PlaatsUpdateInput` object wordt gebruikt bij het bijwerken van een bestaande plaats in de database.
 * @apiExample {json} PlaatsUpdateInput Example
 *    {
 *      "naam": "Rotterdam",
 *      "straat": "Nieuwehaven",
 *      "huisnummer": "10",
 *      "postcode": "3000AA",
 *      "gemeente": "Rotterdam"
 *    }
 */
export interface PlaatsUpdateInput extends PlaatsCreateInput {}

/**
 * @api {object} CreatePlaatsRequest CreatePlaatsRequest Object
 * @apiName CreatePlaatsRequest
 * @apiGroup Plaats
 * @apiDescription Het `CreatePlaatsRequest` object wordt gebruikt om een nieuwe plaats aan te maken via een API-aanroep.
 * @apiExample {json} CreatePlaatsRequest Example
 *    {
 *      "naam": "Utrecht",
 *      "straat": "Voorstraat",
 *      "huisnummer": "15",
 *      "postcode": "3500AA",
 *      "gemeente": "Utrecht"
 *    }
 */
export interface CreatePlaatsRequest extends PlaatsCreateInput {}

/**
 * @api {object} UpdatePlaatsRequest UpdatePlaatsRequest Object
 * @apiName UpdatePlaatsRequest
 * @apiGroup Plaats
 * @apiDescription Het `UpdatePlaatsRequest` object wordt gebruikt om de gegevens van een bestaande plaats bij te werken.
 * @apiExample {json} UpdatePlaatsRequest Example
 *    {
 *      "naam": "Haarlem",
 *      "straat": "Koudenhoorn",
 *      "huisnummer": "2",
 *      "postcode": "2012AA",
 *      "gemeente": "Haarlem"
 *    }
 */
export interface UpdatePlaatsRequest extends PlaatsUpdateInput {}

/**
 * @api {object} GetAllPlaatsResponse GetAllPlaatsResponse Object
 * @apiName GetAllPlaatsResponse
 * @apiGroup Plaats
 * @apiDescription Het `GetAllPlaatsResponse` object bevat een lijst van plaatsen. 
 * Dit wordt teruggegeven als reactie op een aanvraag om alle plaatsen op te halen.
 * @apiSuccess {Object[]} items Lijst van plaatsen.
 * @apiExample {json} GetAllPlaatsResponse Example
 *    {
 *      "items": [
 *        {
 *          "id": 1,
 *          "naam": "Grote markt dendermonde",
 *          "straat": "Grote Markt",
 *          "huisnummer": "5",
 *          "postcode": "9200",
 *          "gemeente": "Dendermonde"
 *        },
 *        {
 *          "id": 2,
 *          "naam": "Klokhuis",
 *          "straat": "Kaaiplein",
 *          "huisnummer": "11",
 *          "postcode": "9220",
 *          "gemeente": "Hamme"
 *        }
 *      ]
 *    }
 */
export interface GetAllPlaatsResponse extends ListResponse<Plaats> {}

/**
 * @api {object} GetPlaatsByIdResponse GetPlaatsByIdResponse Object
 * @apiName GetPlaatsByIdResponse
 * @apiGroup Plaats
 * @apiDescription Het `GetPlaatsByIdResponse` object wordt gebruikt om de details van 
 * een specifieke plaats op te halen, op basis van het id.
 * @apiSuccess {Object} plaats Gegevens van de plaats.
 * @apiExample {json} GetPlaatsByIdResponse Example
 *    {
 *      "id": 1,
 *          "naam": "Grote markt dendermonde",
 *          "straat": "Grote Markt",
 *          "huisnummer": "5",
 *          "postcode": "9200",
 *          "gemeente": "Dendermonde"
 *    }
 */
export interface GetPlaatsByIdResponse extends Plaats {}

/**
 * @api {object} CreatePlaatsResponse CreatePlaatsResponse Object
 * @apiName CreatePlaatsResponse
 * @apiGroup Plaats
 * @apiDescription Het `CreatePlaatsResponse` object bevat de gegevens van de nieuw aangemaakte plaats. 
 * Dit wordt teruggegeven als reactie op een succesvolle plaats-aanmaak.
 * @apiSuccess {Object} plaats Gegevens van de nieuw aangemaakte plaats.
 * @apiExample {json} CreatePlaatsResponse Example
 *    {
 *      "id": 3,
 *      "naam": "Zenith",
 *      "straat": "Otterstraat ",
 *      "huisnummer": "85",
 *      "postcode": "9200",
 *      "gemeente": "Dendermonde"
 *    }
 */
export interface CreatePlaatsResponse extends GetPlaatsByIdResponse {}

/**
 * @api {object} UpdatePlaatsResponse UpdatePlaatsResponse Object
 * @apiName UpdatePlaatsResponse
 * @apiGroup Plaats
 * @apiDescription Het `UpdatePlaatsResponse` object bevat de bijgewerkte gegevens van de plaats. 
 * Dit wordt teruggegeven als reactie op een succesvolle plaats-update.
 * @apiSuccess {Object} plaats Gegevens van de bijgewerkte plaats.
 * @apiExample {json} UpdatePlaatsResponse Example
 *    {
 *      "id": 2,
 *          "naam": "KlokhuisUpdated",
 *          "straat": "Kaaiplein",
 *          "huisnummer": "18",
 *          "postcode": "9220",
 *          "gemeente": "Hamme"
 *    }
 */
export interface UpdatePlaatsResponse extends GetPlaatsByIdResponse {}
