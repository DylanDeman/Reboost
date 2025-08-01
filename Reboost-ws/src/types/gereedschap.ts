import type { Entity } from './common';

export interface Gereedschap extends Entity {
  id: number;
  naam: string;
  beschrijving: string;
  beschikbaar: boolean;
}

export interface GereedschapCreateInput {
  naam: string;
  beschrijving: string;
  beschikbaar: boolean;
  evenementId?: number | undefined; 
}

export interface GereedschapUpdateInput {
  naam?: string | undefined;
  beschrijving?: string | undefined;
  beschikbaar?: boolean | undefined;
  evenementId?: number | undefined; 
}

export interface GereedschapListResponse {
  gereedschappen: Gereedschap[];
  totalCount: number;
}
export interface GereedschapByIdResponse extends Gereedschap {}
export interface GereedschapCreateResponse extends Gereedschap {}
export interface GereedschapUpdateResponse extends Gereedschap {}
export interface GereedschapDeleteResponse {
  success: boolean;
  message: string;
}

export interface GereedschapEventResponse {
  gereedschap: Gereedschap;
  evenement: {
    id: number;
    naam: string;
    datum: Date;
  };
}
