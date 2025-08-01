import { IoTrashOutline, IoPencil } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { memo } from 'react';

const GereedschapMemoized = memo(function Gereedschap({ id, naam, beschrijving, beschikbaar, evenement, onDelete }) {

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <tr>
      <td data-cy='gereedschap_id'>{id}</td>
      <td data-cy='gereedschap_naam'>{naam}</td>
      <td data-cy='gereedschap_beschrijving'>{beschrijving}</td>
      <td data-cy='gereedschap_beschikbaar'>{beschikbaar ? 'Ja' : 'Nee'}</td>
      <td data-cy='gereedschap_evenement_naam'>{evenement?.naam}</td>
      <td>
        {onDelete ? (
          <>
            <Link
              data-cy='gereedschap_bewerk_knop'
              to={`/gereedschap/edit/${id}`}
              className='btn btn-warning'
            >
              <IoPencil />
            </Link>
            <button
              className='btn btn-danger'
              onClick={handleDelete}
            >
              <IoTrashOutline data-cy='gereedschap_verwijder_knop' />
            </button>
          </>
        ) : null}
      </td>
    </tr>
  );
});

export default GereedschapMemoized;
