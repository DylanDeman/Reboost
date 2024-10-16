import { IoTrashOutline } from 'react-icons/io5';

const dateFormat = new Intl.DateTimeFormat('nl-BE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const Evenement = ({ id, naam, datum, plaats, auteur, onDelete }) => {

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <tr>
      <td>{id}</td>
      <td>{naam}</td>
      <td>{dateFormat.format(new Date(datum))}</td>
      <td>{plaats.adres}</td>
      <td>{auteur.naam}</td>
      <td><button className='btn btn-danger' onClick={handleDelete}>
        <IoTrashOutline></IoTrashOutline></button></td>
    </tr>
  );
};

export default Evenement;