import { useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeContext } from '../contexts/Theme.context';
import { IoMoonSharp, IoSunny } from 'react-icons/io5';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { isAuthenticated } = useAuth0();
  const { theme, toggleTheme } = useContext(ThemeContext);

 
  const textColorClass = theme === 'dark' ? 'text-light' : 'text-dark';


  useEffect(() => {
    document.body.style.backgroundColor = theme === 'dark' ? '#212529' : '#f8f9fa'; 
  }, [theme]);

  return (
    <nav className={`navbar navbar-expand-lg sticky-top bg-${theme} ${theme === 'dark' ? 'navbar-dark' : 'navbar-light'} mb-4`}>
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/evenementen">
          <img src="../../reboost_logo.png" alt="Reboost logo" width="50" height="50" />
        </NavLink>


        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className={`nav-link ${textColorClass}`} to="/evenementen">
                Evenementen
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={`nav-link ${textColorClass}`} to="/plaatsen">
                Plaatsen
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={`nav-link ${textColorClass}`} to="/about">
                Over ons
              </NavLink>
            </li>
            {isAuthenticated ? (
              <li className="nav-item">
                <Link className={`nav-link ${textColorClass}`} to="/logout">
                  Uitloggen
                </Link>
              </li>
            ) : (
              <li className="nav-item">
                <Link className={`nav-link ${textColorClass}`} to="/login">
                  Inloggen
                </Link>
              </li>
            )}
          </ul>


          <button
            className={`btn btn-outline-${theme === 'dark' ? 'light' : 'dark'} ms-auto`}
            type="button"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <IoMoonSharp /> : <IoSunny />}
          </button>
        </div>
      </div>
    </nav>
  );
}
