import { Link } from 'react-router-dom';
import { IoTrashOutline, IoPencil, IoLocationOutline } from 'react-icons/io5';
import { memo, useCallback, useContext } from 'react';
import { ThemeContext } from '../../contexts/Theme.context';

const PlaatsMemoized = memo(function Plaats({ id, naam, straat, huisnummer, postcode, gemeente, onDelete }) {

  const { theme, textTheme } = useContext(ThemeContext);
  
  const handleDelete = useCallback(() => {
    onDelete(id);
  }, [id, onDelete]);

  return (
    <div className={`card text-${textTheme} card-bg bg-${theme} bg-gradient border-0 h-100 d-flex flex-column shadow-sm`}>
      <div className='card-body d-flex flex-column p-4'>
        <div className="d-flex align-items-center mb-3">
          <IoLocationOutline className="me-2 text-primary" size={20} />
          <h5 className='card-title mb-0 fw-bold' data-cy='plaats_naam'>{naam}</h5>
        </div>
        
        <div className="flex-grow-1">
          <div className='card-text mb-3' data-cy='plaats_adres'>
            <p className={`mb-1 fw-medium text-${textTheme}`}>{straat} {huisnummer}</p>
            <p className={`mb-0 text-${textTheme} opacity-75`}>{postcode} {gemeente}</p>
          </div>
        </div>
        
        {onDelete && (
          <div className="mt-auto pt-3 border-top">
            <div className="d-flex gap-2">
              <Link 
                data-cy='plaats_edit' 
                to={`/plaatsen/edit/${id}`} 
                className='btn btn-outline-warning btn-sm flex-fill d-flex align-items-center justify-content-center'
              >
                <IoPencil className="me-1" size={16} />
                Bewerken
              </Link>
              <button 
                data-cy='plaats_delete' 
                className='btn btn-outline-danger btn-sm flex-fill d-flex align-items-center justify-content-center' 
                onClick={handleDelete}
              >
                <IoTrashOutline className="me-1" size={16} />
                Verwijderen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default PlaatsMemoized;