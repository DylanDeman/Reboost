import { Auth0Provider } from '@auth0/auth0-react';
import { useLocation } from 'react-router-dom';

export const AuthProvider = ({ children }) => {

  const { pathname } = useLocation();
  //TODO: useLocation gebruiken om juiste callback url door te geven
  return (
    <Auth0Provider
      domain="dev-eu5g8sejk0b6k23l.us.auth0.com"
      clientId="DsCO5tTYas6vWM3MrPCZ4h9Qw5IuXExs"
      authorizationParams={{
        redirect_uri: pathname,
      }}
    >
      {children}

    </Auth0Provider>
  );
};