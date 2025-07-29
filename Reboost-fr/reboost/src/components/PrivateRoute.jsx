import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/auth';


export default function PrivateRoute() {
  const { ready, isAuthed } = useAuth();
  const { pathname } = useLocation();
  
  if (!ready) {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <h1>Aan het laden...</h1>
            <p>
              Even geduld, we zijn bezig met het laden van de benodigde gegevens.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthed) {
    return <Navigate replace to={`/login?redirect=${pathname}`} />;
  }

  return <Outlet />;
}