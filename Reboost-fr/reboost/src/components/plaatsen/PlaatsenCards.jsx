import Plaats from './Plaats';

export default function PlacesCards({
  plaatsen, onDelete,
}) {

  if (plaatsen.length === 0) {
    return (
      <div className="alert alert-info">
        Er zijn nog geen plaatsen.
      </div>
    );
  }

  return (
    <div className="grid">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 g-3">
        {plaatsen
          .sort((a, b) => a.naam.toUpperCase().localeCompare(b.naam.toUpperCase()))
          .map((p) => (
            <div className="col" key={p.id}>
              <Plaats {...p}  onDelete={onDelete}/>
            </div>
          ))}
      </div>
    </div>
  );
}