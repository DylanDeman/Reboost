import Evenement from './Evenement';

function EvenementenTabel({ evenementen }) {
  if (evenementen.length === 0) {
    return (
      <div className="alert alert-infot">Er staan nog geen evenementen ingepland</div>
    );
  }

  return (
    <div>
      <table className='table table-hover table-responsive'>
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
          {evenementen.map((evenement) => (
            <Evenement key={evenement.id} {...evenement} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EvenementenTabel;

