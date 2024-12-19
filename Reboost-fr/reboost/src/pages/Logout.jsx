import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = () => {
  const { logout } = useAuth0();

  useEffect(() => {
    logout({ logoutParams: { returnTo: 'https://frontendweb-2425-dylandeman-1.onrender.com/about' } });
  }, [logout]);

  return null;
};

export default LogoutButton;
