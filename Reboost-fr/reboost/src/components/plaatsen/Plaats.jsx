// src/components/places/Place.jsx
import { Link } from 'react-router-dom';
import { IoTrashOutline, IoPencil } from 'react-icons/io5';
import { memo, useCallback } from 'react';

const PlaatsMemoized = memo(function Place({ id, naam, straat, huisnummer, postcode, gemeente, onDelete }) {
  const handleDelete = useCallback(() => {
    onDelete(id);
  }, [id, onDelete]);

  return (
    <div className='card card-bg border-dark mb-4'>
      <div className='card-body'>
        <h5 className='card-title'>{naam}</h5>
        <p className='card-text'>{straat} {huisnummer} {postcode} {gemeente}</p>
        {onDelete ?
          <><Link to={`/plaatsen/edit/${id}`} className='btn btn-warning card-link'>
            <IoPencil />
          </Link><button className='btn btn-danger card-link' onClick={handleDelete}><IoTrashOutline /></button></> : ''
        }
      </div>
    </div>
  );
});

export default PlaatsMemoized;
