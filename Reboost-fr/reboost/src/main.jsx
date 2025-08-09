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
import AdminRoute from './components/AdminRoute';
import { AuthProvider } from './contexts/Auth.context.jsx';
import GereedschapsLijst from './pages/gereedschappen/GereedschapsLijst.jsx';
import AddOrEditGereedschap from './pages/gereedschappen/AddOrEditGereedschap.jsx';
import GebruikersLijst from './pages/gebruikers/GebruikersLijst.jsx';
import TooltipInitializer from './components/TooltipInitializer';


const router = createBrowserRouter([
  {
    element: (
        <Layout />
    ), 
    children: [
      { path: '/', element: <Navigate replace to="/evenementen" /> },
      {
        path: '/evenementen',
        children: [
          { index: true, element: <EvenementenLijst /> },
          { 
            path: 'add', 
            element: <PrivateRoute><AddOrEditEvenement /></PrivateRoute> 
          },
          { 
            path: 'edit/:id', 
            element: <PrivateRoute><AddOrEditEvenement /></PrivateRoute> 
          },
        ],
      },
      {
        path: '/plaatsen',
        children: [
          { index: true, element: <PlaatsenLijst /> },
          { 
            path: 'add', 
            element: <PrivateRoute><AddOrEditPlaats /></PrivateRoute> 
          },
          { 
            path: 'edit/:id', 
            element: <PrivateRoute><AddOrEditPlaats /></PrivateRoute> 
          },
        ],
      },
      {
        path: '/gereedschappen',
        element: <PrivateRoute />,
        children: [
          { index: true, element: <GereedschapsLijst /> },
          { path: 'add', element: <AddOrEditGereedschap /> },
          { path: 'edit/:id', element: <AddOrEditGereedschap /> },
        ],
      },
      {
        path: '/gebruikers',
        element: <AdminRoute />,
        children: [
          { index: true, element: <GebruikersLijst /> },
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
        <TooltipInitializer />
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
);
