import { NavLink } from 'react-router-dom';
import { ThemeContext } from '../contexts/Theme.context';
import { IoMoonSharp, IoSunny } from 'react-icons/io5';
import { useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

export default function Navbar() {

  const { isAuthenticated } = useAuth0();

  const { theme, toggleTheme } = useContext(ThemeContext);

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
        {
          isAuthenticated ? (
            <div className='nav-item my-2 mx-sm-3 my-sm-0'>
              <Link className='nav-link' to='/logout'>
                Uitloggen
              </Link>
            </div>
          ) : (
            <div className='nav-item my-2 mx-sm-3 my-sm-0'>
              <Link className='nav-link' to='/login'>
                Inloggen
              </Link>
            </div>
          )
        }
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
