import Evenement from './Evenement';
import { useContext } from 'react'; // 👈 1
import { ThemeContext } from '../../contexts/Theme.context';

function EvenementenTabel({ evenementen, onDelete }) {

  const { theme } = useContext(ThemeContext);

  if (evenementen.length === 0) {
    return (
      <div className="alert alert-info">Er staan nog geen evenementen ingepland</div>
    );
  }
  // TODO: CRUD implementatie
  return (
    <div>
      <table className={`table table-hover table-responsive table-${theme}`}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Naam</th>
            <th>Datum</th>
            <th>PlaatsNaam</th>
            <th>Straat</th>
            <th>Huisnr</th>
            <th>Postcode</th>
            <th>Gemeente</th>
            <th>Auteur</th>
          </tr>
        </thead>
        <tbody>
          {evenementen.map((evenement) => (
            <Evenement key={evenement.id} {...evenement} onDelete={onDelete} />
          ))}

        </tbody>
      </table>
    </div>
  );
};

export default EvenementenTabel;

