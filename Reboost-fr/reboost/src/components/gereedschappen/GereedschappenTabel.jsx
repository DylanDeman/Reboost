import Gereedschap from './Gereedschap.jsx';
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/Theme.context';
import { IoConstructOutline } from 'react-icons/io5';

function GereedschappenTabel({ gereedschappen, onDelete }) {
  const { theme, textTheme } = useContext(ThemeContext);

  if (gereedschappen.length === 0) {
    return (
      <div className="text-center py-5">
        <div className={`alert alert-info bg-${theme} text-${textTheme} border-0 shadow-sm`}>
          <div className="mb-3">
            <IoConstructOutline size={48} className="text-primary opacity-75" />
          </div>
          <h5 className="mb-2">Geen gereedschap gevonden</h5>
          <p data-cy='geen_gereedschap_melding' className="mb-0 opacity-75">
            Er is geen gereedschap beschikbaar dat voldoet aan je filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      {/* Header with count */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <IoConstructOutline className="me-2 text-primary" size={24} />
          <h3 className={`mb-0 text-${textTheme}`}>Gereedschappen</h3>
        </div>
        <span className="badge bg-primary rounded-pill fs-6">
          {gereedschappen.length} {gereedschappen.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Improved table */}
      <div className={`table-responsive bg-${theme} rounded shadow-sm border-0`}>
        <table className={`table table-hover table-${theme} mb-0`}>
          <thead className={`table-${theme === 'dark' ? 'dark' : 'light'}`}>
            <tr>
              <th className="border-0 py-3 fw-bold">ID</th>
              <th className="border-0 py-3 fw-bold">Gereedschap</th>
              <th className="border-0 py-3 fw-bold">Beschrijving</th>
              <th className="border-0 py-3 fw-bold">Status</th>
              <th className="border-0 py-3 fw-bold">Evenement</th>
              <th className="border-0 py-3 fw-bold">Acties</th>
            </tr>
          </thead>
          <tbody>
            {gereedschappen.map(gereedschap => (
              <Gereedschap key={gereedschap.id} {...gereedschap} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GereedschappenTabel;