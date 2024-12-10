import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = () => {
  const { logout } = useAuth0();

  useEffect(() => {
    // method aanroepen op laden van pagina
    logout({ logoutParams: { returnTo: 'http://localhost:5173/evenementen' } });
  }, [logout]);

  return null;
};

export default LogoutButton;
