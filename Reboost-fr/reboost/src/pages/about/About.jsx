// src/pages/about/About.jsx
import { LoremIpsum } from 'react-lorem-ipsum';
import { Outlet, Link } from 'react-router-dom';

const About = () => (
  <div>
    <h1>Over ons</h1>
    <div>
      <p>Bij Reboost verzorgen we het materieel voor jouw evenement</p>

      <div className='dropdown-menu'>
        <a className='dropdown-item'>
          <Link to='/about/services'>Onze diensten</Link> {/* 👈 */}
        </a>
        <a className='dropdown-item'>
          <Link to='/about/history'>Geschiedenis</Link> {/* 👈 */}
        </a>
        <a className='dropdown-item'>
          <Link to='/about/location'>Locatie</Link> {/* 👈 */}
        </a>
      </div>
    </div>
    <Outlet /> {/* 👈 */}
  </div>
);

export default About;

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
