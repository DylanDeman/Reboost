import Evenement from './Evenement';
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/Theme.context';
import { IoCalendarOutline } from 'react-icons/io5';

function EvenementenTabel({ evenementen, onDelete }) {

  const { theme, textTheme } = useContext(ThemeContext);

  if (evenementen.length === 0) {
    return (
      <div className="text-center py-5">
        <div className={`alert alert-info bg-${theme} text-${textTheme} border-0 shadow-sm`}>
          <div className="mb-3">
            <IoCalendarOutline size={48} className="text-primary opacity-75" />
          </div>
          <h5 className="mb-2">Nog geen evenementen</h5>
          <p data-cy='geen_evenementen_melding' className="mb-0 opacity-75">
            Er staan nog geen evenementen ingepland. Voeg je eerste evenement toe om te beginnen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">

      <div className={`table-responsive bg-${theme} rounded shadow-sm border-0`}>
        <table className={`table table-hover table-${theme} mb-0`}>
          <thead className={`table-${theme === 'dark' ? 'dark' : 'light'}`}>
            <tr>
              <th className="border-0 py-3 fw-bold">ID</th>
              <th className="border-0 py-3 fw-bold">Evenement</th>
              <th className="border-0 py-3 fw-bold">Datum</th>
              <th className="border-0 py-3 fw-bold">Locatie</th>
              <th className="border-0 py-3 fw-bold">Adres</th>
              <th className="border-0 py-3 fw-bold">Auteur</th>
              <th className="border-0 py-3 fw-bold">Acties</th>
            </tr>
          </thead>
          <tbody>
            {evenementen.map((evenement) => (
              <Evenement key={evenement.id} {...evenement} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EvenementenTabel;