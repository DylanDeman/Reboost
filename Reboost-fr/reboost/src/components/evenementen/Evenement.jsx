import { IoTrashOutline, IoPencil } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { memo } from 'react';

const dateFormat = new Intl.DateTimeFormat('nl-BE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const EvenementMemoized = memo(function Evenement({ id, naam, datum, plaats, auteur, onDelete }) {

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <tr>
      <td data-cy='evenement'>{id}</td>
      <td data-cy='evenement_naam'>{naam}</td>
      <td data-cy='evenement_datum'>{dateFormat.format(new Date(datum))}</td>
      <td data-cy='evenement_plaats_naam'>{plaats.naam}</td>
      <td data-cy='evenement_plaats_straat'>{plaats.straat}</td>
      <td data-cy='evenement_plaats_huisnummer'>{plaats.huisnummer}</td>
      <td data-cy='evenement_plaats_postcode'>{plaats.postcode}</td>
      <td data-cy='evenement_plaats_gemeente'>{plaats.gemeente}</td>
      <td data-cy='evenement_auteur_naam'>{auteur.naam}</td>
      <td>
        {onDelete ?
          <><Link data-cy='evenement_bewerk_knop' to={`/evenementen/edit/${id}`} className='btn btn-warning'>
            <IoPencil />
          </Link><button className='btn btn-danger' onClick={handleDelete}><IoTrashOutline data-cy='evenement_verwijder_knop' /></button></> : ''
        }
      </td>

    </tr>
  );
},
);
export default EvenementMemoized;