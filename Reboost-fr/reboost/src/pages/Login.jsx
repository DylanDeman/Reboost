import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Login = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (isLoading) {
      console.log('Auth0 is aan het laden');
      return;
    }

    if (!isAuthenticated) {
      console.log('Niet ingelogd, redirecten naar Auth0');
      loginWithRedirect();
    } else {
      console.log('Gebruiker is al ingelogd');
    }
  }, [loginWithRedirect, isAuthenticated, isLoading]);

  return <div>Laden...</div>;
};

export default Login;
