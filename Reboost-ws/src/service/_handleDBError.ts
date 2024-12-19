// src/service/_handleDBError.ts
import ServiceError from '../core/serviceError'; 

const handleDBError = (error: any) => {

  const { code = '', message } = error;

  if (code === 'P2002') {
    switch (true) {
      case message.includes('idx_plaats_naam_unique'):
        throw ServiceError.validationFailed(
          'Er bestaat al een plaats met deze naam',
        );
      default:
        throw ServiceError.validationFailed('Dit item bestaat al');
    }
  }

  if (code === 'P2025') {
    switch (true) {
      case message.includes('fk_evenement_gebruiker'):
        throw ServiceError.notFound('Deze gebruiker bestaat niet');
      case message.includes('fk_evenement_plaats'):
        throw ServiceError.notFound('Deze plaats bestaat niet');
      case message.includes('evenement'):
        throw ServiceError.notFound('Er bestaat geen evenement met dit id');
      case message.includes('plaats'):
        throw ServiceError.notFound('Er bestaat geen plaats met dit id');
      case message.includes('gebruikr'):
        throw ServiceError.notFound('Er bestaat geen gebruiker met dit id');
    }
  }

  if (code === 'P2003') {
    switch (true) {
      case message.includes('plaats_id'):
        throw ServiceError.conflict(
          'Deze plaats bestaat niet of is nog gelinkt aan evenementen',
        );
      case message.includes('auteur_id'):
        throw ServiceError.conflict(
          'Deze plaats bestaat niet of is nog gelinkt aan evenementen',
        );
    }
  }

  throw error;
};

export default handleDBError; 
