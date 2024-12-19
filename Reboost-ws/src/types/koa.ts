import type { ParameterizedContext } from 'koa';
import type Application from 'koa';
import type Router from '@koa/router';

/**
 * @apiDefine ReboostState ReboostState Object
 * @apiDescription Dit object vertegenwoordigt de status van de Koa-toepassing.
 *  Dit kan worden gebruikt om statusinformatie op te slaan die door de hele applicatie heen beschikbaar is.
 * @apiExample {json} ReboostState
 *    {}
 */
export interface ReboostState {}

/**
 * @apiDefine ReboostContext ReboostContext Object
 * @apiDescription Dit object vertegenwoordigt de context van de Koa-toepassing. 
 * Dit kan worden gebruikt om extra informatie toe te voegen die specifiek is voor de huidige aanvraag en reactie.
 * @apiExample {json} ReboostContext
 *    {}
 */
export interface ReboostContext {}

/**
 * @api {object} KoaContext KoaContext Object
 * @apiName KoaContext
 * @apiGroup Koa
 * @apiDescription De `KoaContext` is de context die door Koa wordt gebruikt voor de levensduur van een enkele 
 * aanvraag. Dit object biedt toegang tot alle gegevens die met de aanvraag en de reactie te maken hebben.
 * @apiParam (Request) {Object} request Bevat gegevens over de aanvraag, zoals het aanvraaglichaam en de querystring.
 * @apiParam (Response) {Object} body Bevat de gegevens die naar de client worden gestuurd als antwoord.
 * @apiParam (Params) {Object} params Parameters van de URL, zoals `id` in `/gebruikers/:id`.
 * @apiParam (Query) {Object} query De queryparameters van de URL, zoals `?name=Jan`.
 * 
 * @apiSuccess {Object} context Het KoaContext object dat details van de aanvraag bevat.
 * @apiExample {json} KoaContext Example:
 *    {
 *      "request": {
 *        "body": { "name": "Jan" },
 *        "query": { "filter": "active" }
 *      },
 *      "params": { "id": 1 },
 *      "response": { "status": 200 }
 *    }
 */
export type KoaContext<
  ResponseBody = unknown,
  Params = unknown,
  RequestBody = unknown,
  Query = unknown,
> =
  ParameterizedContext<ReboostState, ReboostContext, ResponseBody>
  & {
    request: {
      body: RequestBody; // Het lichaam van de aanvraag, zoals verzonden in een POST- of PUT-aanroep.
      query: Query; // De queryparameters die in de URL zijn opgenomen (bijvoorbeeld `/api?filter=active`).
    };
    params: Params; // De URL-parameters die in de route zijn gedefinieerd (bijvoorbeeld `/users/:id`).
  };

/**
 * @api {object} KoaApplication KoaApplication Object
 * @apiName KoaApplication
 * @apiGroup Koa
 * @apiDescription Het `KoaApplication` object vertegenwoordigt de gehele Koa applicatie. 
 * Het bevat instellingen voor middleware en routers die door de applicatie worden gebruikt.
 * @apiExample {json} KoaApplication
 *    {}
 */
export interface KoaApplication extends Application<ReboostState, ReboostContext> {}

/**
 * @api {object} KoaRouter KoaRouter Object
 * @apiName KoaRouter
 * @apiGroup Koa
 * @apiDescription Het `KoaRouter` object wordt gebruikt om routes in te stellen voor de Koa-applicatie. 
 * Dit maakt het mogelijk om aanvragen te routeren op basis van de URL-paden en HTTP-methoden.
 * @apiExample {json} KoaRouter
 *    {}
 */
export interface KoaRouter extends Router<ReboostState, ReboostContext> {}
