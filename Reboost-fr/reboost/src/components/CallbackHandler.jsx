// src/components/CallbackHandler.jsx
import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const CallbackHandler = () => {
  const { handleRedirectCallback, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      try {
        await handleRedirectCallback();
      } catch (e) {
        console.error('Error met callback handlen:', e);
      }
    };

    if (isLoading) return; 
    if (isAuthenticated) {
      navigate('/'); 
    } else {
      handleAuthRedirect(); 
    }
  }, [isAuthenticated, isLoading, handleRedirectCallback, navigate]);

  return null; 
};

export default CallbackHandler;
