// src/components/Error.jsx
import { isAxiosError } from 'axios';

export default function Error({ error }) {
  if (!error) return null;

  if (isAxiosError(error)) {
    // Handle API errors
    const statusCode = error?.response?.status;
    let errorMessage = error?.response?.data?.message || error.message;
    let detailsMessage = error?.response?.data?.details || '';

    // Custom messages for common status codes
    if (statusCode === 401) {
      errorMessage = 'Ongeldige inloggegevens. Controleer je gebruikersnaam en wachtwoord.';
    } else if (statusCode === 403) {
      errorMessage = 'Je hebt geen toegang tot deze resource.';
    } else if (statusCode === 404) {
      errorMessage = 'Resource niet gevonden.';
    } else if (statusCode >= 500) {
      errorMessage = 'Er is een fout opgetreden op de server. Probeer het later opnieuw.';
    }

    return (
      <div className='alert alert-danger' data-cy="axios_error_message">
        <h5 className='alert-heading'>Er is een fout opgetreden</h5>
        <p className="mb-0">{errorMessage}</p>
        {detailsMessage && <small className="d-block mt-2">{JSON.stringify(detailsMessage)}</small>}
      </div>
    );
  }

  // Handle other error types
  let errorMessage = '';
  
  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error.message) {
    errorMessage = error.message;
  } else {
    errorMessage = 'Er is een onverwachte fout opgetreden.';
  }

  return (
    <div className='alert alert-danger' data-cy="error">
      <h5 className='alert-heading'>Fout</h5>
      <p className="mb-0">{errorMessage}</p>
    </div>
  );
}
