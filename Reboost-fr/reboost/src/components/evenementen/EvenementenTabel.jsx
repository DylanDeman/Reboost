import Evenement from './Evenement';
import { useState } from 'react';
import { EVENEMENT_DATA } from '../../api/mock_data';

const EvenementenTabel = () => {
  const [evenementen, setEvenementen] = useState(EVENEMENT_DATA);

  const handleDeleteEvenement = (id) => {
    setEvenementen((evenementen) => evenementen.filter((p) => p.id !== id));
  };

  if (evenementen.length === 0) {
    return (
      <div className="alert alert-info">Er staan nog geen evenementen ingepland</div>
    );
  }
  // TODO: delete handler fixen, worden gedisplayed als losse tekst, moeten weer in tabelvorm staan.
  return (
    <div>
      <table className='table table-hover table-responsive table-dark'>
        <thead>
          <tr>
            <th>Id</th>
            <th>Naam</th>
            <th>Datum</th>
            <th>Plaats</th>
            <th>Auteur</th>
          </tr>
        </thead>
        <tbody>
          {evenementen
            .map((p) => (
              <div className='col' key={p.id}>
                <Evenement {...p}
                  onDelete={handleDeleteEvenement} />
              </div>
            ))}

        </tbody>
      </table>
    </div>
  );
};

export default EvenementenTabel;

