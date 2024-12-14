import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import EvenementenLijst from './pages/Evenementen/EvenementenLijst.jsx';
import Layout from './pages/Layout';
import { Navigate } from 'react-router-dom';
import NotFound from './pages/notFound/NotFound.jsx';
import About, { Services, History, Location } from './pages/about/About.jsx';
import AddOrEditEvenement from './pages/Evenementen/AddOrEditEvenement.jsx';
import PlaatsenLijst from './pages/plaatsen/PlaatsenLijst.jsx';
import { ThemeProvider } from './contexts/Theme.context';
import AddOrEditPlaats from './pages/plaatsen/AddOrEditPlaats.jsx';
import Login from './pages/Login.jsx';
import Logout from './pages/Logout.jsx';
import PrivateRoute from './components/PrivateRoute';
import AuthProvider from './contexts/Auth.context.jsx';
import CallbackHandler from './components/CallbackHandler.jsx';

const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <Layout />
      </AuthProvider>
    ), 
    children: [
      { path: '/', element: <Navigate replace to="/evenementen" /> },
      {
        path: '/evenementen',
        element: <PrivateRoute />,
        children: [
          { index: true, element: <EvenementenLijst /> },
          { path: 'add', element: <AddOrEditEvenement /> },
          { path: 'edit/:id', element: <AddOrEditEvenement /> },
        ],
      },
      {
        path: '/plaatsen',
        element: <PrivateRoute />,
        children: [
          { index: true, element: <PlaatsenLijst /> },
          { path: 'add', element: <AddOrEditPlaats /> },
          { path: 'edit/:id', element: <AddOrEditPlaats /> },
        ],
      },
      {
        path: '/about',
        element: <About />,
        children: [
          { path: 'services', element: <Services /> },
          { path: 'history', element: <History /> },
          { path: 'location', element: <Location /> },
        ],
      },
      { path: '*', element: <NotFound /> },
      { path: '/login', element: <Login /> }, 
      { path: '/logout', element: <Logout /> },
      {
        path: '/callback', 
        element: <CallbackHandler />, 
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
