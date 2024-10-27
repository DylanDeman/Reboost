import type { Entity, ListResponse } from './common';

export interface Plaats extends Entity {
  naam: string;
  straat: string;
  huisnummer: string;
  postcode:string;
  gemeente:string;
}

export interface PlaatsCreateInput {
  naam: string;
  straat: string;
  huisnummer: string;
  postcode:string;
  gemeente:string;
}

export interface PlaatsUpdateInput extends PlaatsCreateInput {}

export interface CreatePlaatsRequest extends PlaatsCreateInput {}
export interface UpdatePlaatsRequest extends PlaatsUpdateInput {}

export interface GetAllPlaatsResponse extends ListResponse<Plaats> {}
export interface GetPlaatsByIdResponse extends Plaats {}
export interface CreatePlaatsResponse extends GetPlaatsByIdResponse {}
export interface UpdatePlaatsResponse extends GetPlaatsByIdResponse {}
