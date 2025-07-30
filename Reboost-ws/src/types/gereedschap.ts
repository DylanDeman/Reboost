import type { Entity } from './common';

export interface Gereedschap extends Entity {
  id: number;
  naam: string;
  beschrijving: string;
  beschikbaar: boolean;
  verhuurd: boolean;
  evenement?: {
    id: number;
    naam: string;
    datum: Date;
  }; 
}

export interface GereedschapCreateInput {
  naam: string;
  beschrijving: string;
  beschikbaar: boolean;
  verhuurd: boolean;
  evenementId?: number; 
}

export interface GereedschapUpdateInput {
  naam?: string;
  beschrijving?: string;
  beschikbaar?: boolean;
  verhuurd?: boolean;
  evenementId?: number; 
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
