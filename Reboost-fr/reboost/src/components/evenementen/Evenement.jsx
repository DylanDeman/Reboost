import {
  IoTrashOutline,
  IoPencil,
  IoLocationOutline,
  IoPersonOutline,
  IoCalendarOutline,
  IoDocumentTextOutline,
} from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { memo, useContext } from 'react';
import { ThemeContext } from '../../contexts/Theme.context';
import generateEvenementPdf from '../pdf/EvenementPdfGenerator';

const dateFormat = new Intl.DateTimeFormat('nl-BE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const EvenementMemoized = memo(function Evenement({
  id,
  naam,
  datum,
  plaats,
  auteur,
  gereedschappen = [],
  onDelete,
}) {
  const { textTheme } = useContext(ThemeContext);

  const handleDelete = () => {
    onDelete(id);
  };

  const handlePdfGenerate = () => {
    generateEvenementPdf({ id, naam, datum, plaats, auteur, gereedschappen });
  };

  return (
    <tr className="align-middle">
      <td data-cy="evenement" className="fw-medium">
        {id}
      </td>

      <td data-cy="evenement_naam" className="fw-bold">
        <div className="d-flex align-items-center">
          <IoCalendarOutline className="me-2 text-primary" size={16} />
          {naam}
        </div>
      </td>

      <td data-cy="evenement_datum">
        <span className="badge bg-light text-dark border">
          {dateFormat.format(new Date(datum))}
        </span>
      </td>

      <td data-cy="evenement_plaats_naam" className="fw-medium">
        <div className="d-flex align-items-center">
          <IoLocationOutline className="me-2 text-success" size={14} />
          {plaats.naam}
        </div>
      </td>

      <td data-cy="evenement_adres">
        <div className={`small text-${textTheme} opacity-75`}>
          <div>
            {plaats.straat} {plaats.huisnummer}
          </div>
          <div>
            {plaats.postcode} {plaats.gemeente}
          </div>
        </div>
      </td>

      <td data-cy="evenement_auteur_naam">
        <div className="d-flex align-items-center">
          <IoPersonOutline className="me-2 text-info" size={14} />
          <span className="small">{auteur.naam}</span>
        </div>
      </td>

      <td>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={handlePdfGenerate}
            title="Genereer PDF"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
          >
            <IoDocumentTextOutline size={14} />
          </button>

          <Link
            data-cy="evenement_bewerk_knop"
            to={`/evenementen/edit/${id}`}
            className="btn btn-outline-warning btn-sm"
            title="Bewerken"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
          >
            <IoPencil size={14} />
          </Link>

          {onDelete && (
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleDelete}
              title="Verwijderen"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
            >
              <IoTrashOutline data-cy="evenement_verwijder_knop" size={14} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
});

export default EvenementMemoized;
