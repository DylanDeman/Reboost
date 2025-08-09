import type { Prisma } from '@prisma/client';
import type { Entity, ListResponse } from './common';
export interface Gebruiker extends Entity {
  naam: string;
  wachtwoord: string;
  roles: Prisma.JsonValue;

}

export interface GebruikerCreateInput {
  naam: string;
  wachtwoord: string;
  roles: Prisma.JsonValue;
}

export interface PublicGebruiker extends Omit<Gebruiker, 'wachtwoord'> {}

export interface GebruikerUpdateInput {
  naam?: string;
  roles?: Prisma.JsonValue;
  wachtwoord?: string;
}

export interface LoginRequest {
  naam: string;
  wachtwoord: string;
}

export interface GetGebruikerRequest {
  id: number | 'me';
}
export interface RegisterGebruikerRequest {
  naam: string;
  wachtwoord: string;
  roles: Prisma.JsonValue;
}
export interface UpdateGebruikerRequest extends Omit<RegisterGebruikerRequest, 'wachtwoord' | 'roles'> {}

export interface GetAllGebruikersResponse extends ListResponse<PublicGebruiker> {}
export interface GetGebruikerByIdResponse extends PublicGebruiker {}
export interface UpdateGebruikerResponse extends GetGebruikerByIdResponse {}

export interface LoginResponse {
  token: string;
}
