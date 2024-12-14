import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = () => {
  const { logout } = useAuth0();

  useEffect(() => {
    logout({ logoutParams: { returnTo: 'http://localhost:5173/about' } });
  }, [logout]);

  return null;
};

export default LogoutButton;
