import { NavLink } from 'react-router-dom';
import { useTheme } from '../contexts/theme'; // 👈 1
import { IoMoonSharp, IoSunny } from 'react-icons/io5';

export default function Navbar() {

  const { theme, toggleTheme } = useTheme(); // 👈 2

  return (
    <nav className={`navbar sticky-top bg-${theme} text-bg-${theme} mb-4`}>
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
            Over ons
          </NavLink>
        </div>
        <div className='flex-grow-1'></div>
        <button
          className='btn bg-color'
          type='button'
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <IoMoonSharp /> : <IoSunny />}
        </button>
      </div>
    </nav>
  );
}
