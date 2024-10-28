// src/components/Navbar.jsx
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className='navbar sticky-top mb-4 navbar-dark bg-dark text-light'>
      <div className='container-fluid flex-column flex-sm-row align-items-start align-items-sm-center'>
        <div className='nav-item my-2 mx-sm-3 my-sm-0'>
          <NavLink className='nav-link' to='/evenementen'>
            <img src="../../reboost_logo.png" alt="Reboost logo" width="50" height="50" />
          </NavLink>
        </div>
        <div className='nav-item my-2 mx-sm-3 my-sm-0'>
          <NavLink className='nav-link' to='/evenementen'>
            Evenementen
          </NavLink>
        </div>
        <div className='nav-item my-2 mx-sm-3 my-sm-0'>
          <NavLink className='nav-link' to='/plaatsen'>
            Plaatsen
          </NavLink>
        </div>
        <div className='nav-item my-2 mx-sm-3 my-sm-0'>
          <NavLink className='nav-link' to='/about'>
            About us
          </NavLink>
        </div>
        <div className='flex-grow-1'></div>
      </div>
    </nav>
  );
}
