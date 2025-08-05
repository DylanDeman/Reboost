// src/pages/about/About.jsx
import { LoremIpsum } from 'react-lorem-ipsum';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../../contexts/Theme.context';
import { useContext } from 'react';

export default function About() {
  const { textTheme } = useContext(ThemeContext);
  const location = useLocation();

  // Highlight active link based on current path
  const isActive = (path) => location.pathname === path;

  return (
    <div className={`text-${textTheme} container py-4`}>
      <h1 className="mb-4">Over ons</h1>

      <p className="lead mb-4">
        Bij Reboost verzorgen we al jouw evenementbenodigdheden.
      </p>

      <nav aria-label="About section navigation">
        <ul className="nav nav-pills mb-4">
          <li className="nav-item">
            <Link
              to="/about/services"
              className={`nav-link ${isActive('/about/services') ? 'active' : ''} l-hover`}
            >
              Onze diensten
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/about/history"
              className={`nav-link ${isActive('/about/history') ? 'active' : ''} l-hover`}
            >
              Geschiedenis
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/about/location"
              className={`nav-link ${isActive('/about/location') ? 'active' : ''} l-hover`}
            >
              Locatie
            </Link>
          </li>
        </ul>
      </nav>

      <hr />

      <Outlet />
    </div>
  );
}

export const Services = () => (
  <section>
    <h2 className="mb-3">Onze diensten</h2>
    <LoremIpsum p={2} avgSentencesPerParagraph={4} avgWordsPerSentence={12} />
  </section>
);

export const History = () => (
  <section>
    <h2 className="mb-3">Geschiedenis</h2>
    <LoremIpsum p={2} avgSentencesPerParagraph={4} avgWordsPerSentence={12} />
  </section>
);

export const Location = () => (
  <section>
    <h2 className="mb-3">Locatie</h2>
    <p>Wij zijn gebaseerd in Hamme!</p>
  </section>
);
