// src/components/places/Place.jsx
import { Link } from 'react-router-dom';
import { IoTrashOutline } from 'react-icons/io5';
import { memo, useCallback } from 'react';

const PlaatsMemoized = memo(function Place({ id, naam, onDelete }) {
  const handleDelete = useCallback(() => {
    onDelete(id);
  }, [id, onDelete]);

  return (
    <div className='card bg-dark border-dark mb-4'>
      <div className='card-body'>
        <h5 className='card-title'>  <Link to={`/plaatsen/${id}`}>{naam}</Link></h5>
        <button className='btn btn-danger' onClick={handleDelete}>
          <IoTrashOutline />
        </button>
      </div>
    </div>
  );
});

export default PlaatsMemoized;
