import Plaats from './Plaats';

export default function PlaatsenCards({ plaatsen, onDelete }) {
  if (!plaatsen?.length) {
    return (
      <div className="alert alert-info">
        Er zijn nog geen plaatsen.
      </div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 g-4">
      {plaatsen
        .sort((a, b) => a.naam.toUpperCase().localeCompare(b.naam.toUpperCase()))
        .map((p) => (
          <div className="col" key={p.id}>
            <div className="card h-100 shadow-sm hover-shadow transition">
              <Plaats data-cy="plaats" {...p} onDelete={onDelete} />
            </div>
          </div>
        ))}
    </div>
  );
}
