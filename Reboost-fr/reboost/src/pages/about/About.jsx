// src/pages/about/About.jsx
import { LoremIpsum } from 'react-lorem-ipsum';
import { Outlet, Link } from 'react-router-dom';
import { ThemeContext } from '../../contexts/Theme.context';
import { useContext } from 'react';

export default function About() {

  const { textTheme } = useContext(ThemeContext);

  return (
    <div className={`text-${textTheme}`}>
      <h1 >Over ons</h1>
      <div>
        <p>Bij Reboost verzorgen we al jouw evenementbenodigdheden</p>

        <ul >
          <li>
            <Link className='l-hover' to='/about/services'>Onze diensten</Link>
          </li>
          <li>
            <Link className='l-hover' to='/about/history'>Geschiedenis</Link>
          </li>
          <li>
            <Link className='l-hover' to='/about/location'>Locatie</Link>
          </li>
        </ul>
      </div>
      <Outlet />
    </div>
  );
}

export const Services = () => (
  <div>
    <h1>Onze diensten</h1>
    <LoremIpsum p={2} />
  </div>
);

export const History = () => (
  <div>
    <h1>Geschiedenis</h1>
    <LoremIpsum p={2} />
  </div>
);

export const Location = () => (
  <div>
    <h1>Locatie</h1>
    <p>Wij zijn gebaseerd in Hamme!</p>
  </div>
);
