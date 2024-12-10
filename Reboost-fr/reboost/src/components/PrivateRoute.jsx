// src/components/PrivateRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

export default function PrivateRoute() {
  const { isLoading, isAuthed } = useAuth0();
  const { pathname } = useLocation();

  if (!isLoading) {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <h1>Laden...</h1>
            <p>
              Even geduld, we controleren of je bent ingelogd.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthed) {
    return <Outlet />;
  }

  return <Navigate replace to={`/login?redirect=${pathname}`} />;
}
