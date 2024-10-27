import type { Gebruiker } from '@prisma/client';
import type { Entity, ListResponse } from './common';
import type { Plaats } from './plaats';

export interface Evenement extends Entity {
  naam: string;
  datum: Date;
  auteur: Pick<Gebruiker, 'id' | 'naam'>;
  plaats: Pick<Plaats, 'id' | 'id'>;
}

export interface EvenementCreateInput {
  naam: string;
  datum: Date;
  plaats: Plaats
  auteur_id: number;
  plaats_id: number;
}

export interface EvenementUpdateInput extends EvenementCreateInput {}

export interface CreateEvenementRequest extends EvenementCreateInput {}
export interface UpdateEvenementRequest extends EvenementUpdateInput {}

export interface GetAllEvenementenReponse extends ListResponse<Evenement> {}
export interface GetEvenementByIdResponse extends Evenement {}
export interface CreateEvenementResponse extends GetEvenementByIdResponse {}
export interface UpdateEvenementResponse extends GetEvenementByIdResponse {}
