import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from '../components/navbar';

export default function Layout() {
  return (
    <div className='container-xl'>
      <Navbar />
      <Outlet />
      <ScrollRestoration />
    </div>
  );
}
