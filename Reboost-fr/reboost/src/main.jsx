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
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/Auth.context.jsx';


const router = createBrowserRouter([
  {
    element: (
        <Layout />
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
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
);
