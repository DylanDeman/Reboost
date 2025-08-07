import { IoTrashOutline, IoPencil, IoConstructOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline, IoCalendarOutline, IoLockClosed  } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { memo, useContext } from 'react';
import { ThemeContext } from '../../contexts/Theme.context';

const GereedschapMemoized = memo(function Gereedschap({ id, naam, beschrijving, beschikbaar, evenement, onDelete }) {

  const { textTheme } = useContext(ThemeContext);

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <tr className="align-middle">
      <td data-cy='gereedschap_id' className="fw-medium">{id}</td>

      <td data-cy='gereedschap_naam' className="fw-bold">
        <div className="d-flex align-items-center">
          <IoConstructOutline className="me-2 text-primary" size={16} />
          {naam}
        </div>
      </td>

      <td data-cy='gereedschap_beschrijving'>
        <span className={`text-${textTheme} opacity-75`}>{beschrijving}</span>
      </td>

      <td data-cy='gereedschap_beschikbaar'>
        {beschikbaar ? (
          <span className="badge bg-success d-flex align-items-center w-auto">
            <IoCheckmarkCircleOutline className="me-1" size={14} />
            Beschikbaar
          </span>
        ) : (
          <span className="badge bg-danger d-flex align-items-center w-auto">
            <IoCloseCircleOutline className="me-1" size={14} />
            In gebruik
          </span>
        )}
      </td>

      <td data-cy='gereedschap_evenement_naam'>
        {evenement?.naam ? (
          <div className="d-flex align-items-center">
            <IoCalendarOutline className="me-2 text-info" size={14} />
            <span className="small">{evenement.naam}</span>
          </div>
        ) : (
          <span className={`small text-${textTheme} opacity-50 fst-italic`}>
            Geen evenement
          </span>
        )}
      </td>

      <td>
        {onDelete && (
          <div className="d-flex gap-2">
            <Link
              data-cy='gereedschap_bewerk_knop'
              to={`/gereedschappen/edit/${id}`}
              className='btn btn-outline-warning btn-sm'
              title="Bewerken"
            >
              <IoPencil size={14} />
            </Link>
            <button
              className='btn btn-outline-danger btn-sm'
              onClick={handleDelete}
              title={evenement ? "Kan niet verwijderen, gekoppeld aan evenement" : "Verwijderen"}
              disabled={!!evenement}  // disable if evenement exists
              style={{ cursor: evenement ? 'not-allowed' : 'pointer' }}
            >
              {evenement ? (
                <IoLockClosed data-cy='gereedschap_verwijder_knop' size={14} />
              ) : (
                <IoTrashOutline data-cy='gereedschap_verwijder_knop' size={14} />
              )}
            </button>
          </div>
        )}
      </td>
    </tr>
  );
});

export default GereedschapMemoized;