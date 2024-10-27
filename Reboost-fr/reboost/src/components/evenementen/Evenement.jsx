import { IoTrashOutline, IoPencil } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { memo } from 'react';

const dateFormat = new Intl.DateTimeFormat('nl-BE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const EvenementMemoized = memo(function Evenement({ id, naam, datum, locatie, auteur, onDelete }) {

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <tr>
      <td>{id}</td>
      <td>{naam}</td>
      <td>{dateFormat.format(new Date(datum))}</td>
      <td>{locatie.naam}</td>
      <td>{locatie.straat}</td>
      <td>{locatie.huisnummer}</td>
      <td>{locatie.postcode}</td>
      <td>{locatie.gemeente}</td>
      <td>{auteur.naam}</td>
      <td>
        {onDelete ?
          <><Link to={`/evenementen/edit/${id}`} className='btn btn-warning'>
            <IoPencil />
          </Link><button className='btn btn-danger' onClick={handleDelete}><IoTrashOutline /></button></> : ''
        }
      </td>

    </tr>
  );
},
);
export default EvenementMemoized;