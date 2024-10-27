import type { Entity, ListResponse } from './common';

export interface Gebruiker extends Entity {
  naam: string;
  wachtwoord: string
}

export interface GebruikerCreateInput {
  naam: string;
  wachtwoord:string
}

export interface GebruikerUpdateInput extends GebruikerCreateInput {}

export interface CreateGebruikerRequest {
  naam: string;
  wachtwoord: string
}
export interface UpdateGebruikerRequest extends CreateGebruikerRequest {}

export interface GetAllGebruikersResponse extends ListResponse<Gebruiker> {}
export interface GetGebruikerByIdResponse extends Gebruiker {}
export interface CreateGebruikerResponse extends GetGebruikerByIdResponse {}
export interface UpdateGebruikerResponse extends GetGebruikerByIdResponse {
  wachtwoord: string
}
