import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; // 👈
import EvenementenLijst from './pages/Evenementen/EvenementenLijst.jsx';
import Layout from './pages/Layout';
import { Navigate } from 'react-router-dom';
import NotFound from './pages/notFound/NotFound.jsx';
import About, { Services, History, Location } from './pages/about/About.jsx';

// 👇
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Navigate replace to='/evenementen' />,
      },
      {
        path: '/evenementen',
        element: <EvenementenLijst></EvenementenLijst>,
      },
      {
        path: 'about',
        element: <About />,
        children: [
          {
            path: 'services',
            element: <Services />,
          },
          {
            path: 'history',
            element: <History />,
          },
          {
            path: 'location',
            element: <Location />,
          },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
],
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
