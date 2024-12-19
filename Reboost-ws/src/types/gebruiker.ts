import type { Entity, ListResponse } from './common';
import type { Prisma } from '@prisma/client';

export interface LoginRequest {
  naam: string;
  wachtwoord: string;
}

export interface LoginResponse {
  token: string;
}
export interface Gebruiker extends Entity {
  naam: string;
  wachtwoord: string
  roles: Prisma.JsonValue
}

export interface GebruikerCreateInput {
  naam: string;
  wachtwoord:string
}

export interface PublicGebruiker extends Pick<Gebruiker, 'id' | 'naam'> {}

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
