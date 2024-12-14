import { Auth0Provider } from '@auth0/auth0-react';

const AuthProvider = ({ children }) => {

  return (
    <Auth0Provider
      domain="dev-eu5g8sejk0b6k23l.us.auth0.com"
      clientId="DsCO5tTYas6vWM3MrPCZ4h9Qw5IuXExs"
      authorizationParams={{
        redirect_uri: window.location.origin + '/callback', 
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthProvider;
