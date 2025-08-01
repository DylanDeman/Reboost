import Gereedschap from './Gereedschap.jsx';
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/Theme.context';

function GereedschapTabel({ gereedschappen, onDelete }) {
  const { theme } = useContext(ThemeContext);

  if (gereedschappen.length === 0) {
    return (
      <div data-cy='geen_gereedschap_melding' className='alert alert-info'>
        Er is geen gereedschap beschikbaar
      </div>
    );
  }

  return (
    
    <div className={`table-responsive-${theme}`} style={{ overflowX: 'auto' }}>
      <table className={`table table-hover table-${theme}`}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Naam</th>
            <th>Beschrijving</th>
            <th>Beschikbaar</th>
            <th>Evenement</th>
            <th>Acties</th>
          </tr>
        </thead>
        <tbody>
          {gereedschappen.map((gereedschap) => (
            <Gereedschap key={gereedschap.id} {...gereedschap} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GereedschapTabel;
