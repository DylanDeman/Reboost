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
