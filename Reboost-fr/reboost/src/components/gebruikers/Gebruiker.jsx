import { memo, useContext } from 'react';
import { ThemeContext } from '../../contexts/Theme.context';
import DisabledButtonTooltip from '../DisabledButtonTooltip';
import {
  IoTrashOutline,
  IoPencilOutline,
  IoPersonOutline,
  IoShieldOutline,
  IoLockClosedOutline
} from 'react-icons/io5';

const GebruikerMemoized = memo(function Gebruiker({ 
  id, 
  naam, 
  roles = [], 
  onEdit, 
  onDelete,
  isAuthed = false,
  isLinkedToEvenement  
}) {
  const { theme, textTheme } = useContext(ThemeContext);
  
  const isAdmin = Array.isArray(roles) ? roles.includes('admin') : false;
  
  const handleEdit = () => {
    onEdit({ id, naam, roles });
  };

  const handleDelete = () => {
    if (!isLinkedToEvenement) {
      onDelete({
        id,
        naam,
        isLinkedToEvenement
      });
    }
  };

  return (
    <tr className={`align-middle ${theme === 'dark' ? 'text-light' : ''}`}>
      <td data-cy="gebruiker">{id}</td>

      <td data-cy="gebruiker_naam">
        <div className="d-flex align-items-center">
          <IoPersonOutline className="me-2 text-primary" size={16} />
          <span className="fw-medium">{naam}</span>
        </div>
      </td>

      <td data-cy="gebruiker_roles">
        <div className="d-flex flex-wrap gap-1">
          {Array.isArray(roles) && roles.map(role => (
            <span 
              key={role} 
              className={`badge ${role === 'admin' ? 'bg-danger' : 'bg-secondary'} d-flex align-items-center`}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title={role === 'admin' ? 'Beheerder met extra rechten' : 'Standaard gebruikersrol'}
            >
              <IoShieldOutline className="me-1" size={12} />
              {role}
            </span>
          ))}
        </div>
      </td>

      <td className="text-end">
        {isAuthed && (
          <div className="d-flex justify-content-end gap-1">
            <button
              data-cy="gebruiker_bewerk_knop"
              onClick={handleEdit}
              className="btn btn-outline-warning btn-sm"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Bewerken"
            >
              <IoPencilOutline size={16} />
            </button>

            {isLinkedToEvenement ? (
              <DisabledButtonTooltip title="Kan niet verwijderen: gekoppeld aan evenement">
                <button
                  className="btn btn-outline-danger btn-sm"
                  disabled
                  data-cy="gebruiker_locked_knop"
                >
                  <IoLockClosedOutline size={16} />
                </button>
              </DisabledButtonTooltip>
            ) : (
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleDelete}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Verwijderen"
                data-cy="gebruiker_verwijder_knop"
              >
                <IoTrashOutline size={16} />
              </button>
            )}
          </div>
        )}
      </td>
    </tr>
  );
});

export default GebruikerMemoized;
