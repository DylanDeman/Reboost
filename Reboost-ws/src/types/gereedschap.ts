import type { Entity, ListResponse } from './common';
import type { Evenement } from './evenement';

export interface Gereedschap extends Entity {
  naam: string;
  beschrijving: string;
  beschikbaar: boolean;
  evenement?: Pick<Evenement, 'id' | 'naam' | 'datum'> | null;
}

export interface GereedschapCreateInput {
  naam: string;
  beschrijving: string;
  beschikbaar: boolean;
  evenementId?: number | null;
}

export interface GereedschapUpdateInput {
  naam?: string;
  beschrijving?: string;
  beschikbaar?: boolean;
  evenementId?: number | null;
}

export interface GereedschapListResponse extends ListResponse<Gereedschap> {}

export interface GereedschapByIdResponse extends Gereedschap {}

export interface GereedschapCreateResponse extends Gereedschap {}

export interface GereedschapUpdateResponse extends Gereedschap {}

export interface GereedschapDeleteResponse {
  success: boolean;
  message: string;
}

export interface GereedschapEventResponse {
  gereedschap: Gereedschap;
  evenement: Pick<Evenement, 'id' | 'naam' | 'datum'> | null;
}
