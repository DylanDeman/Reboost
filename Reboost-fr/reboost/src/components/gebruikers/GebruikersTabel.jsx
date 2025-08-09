import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/Theme.context';
import Gebruiker from './Gebruiker';
import { IoPersonOutline, IoShieldOutline } from 'react-icons/io5';

export default function GebruikersTabel({
  gebruikers = [],
  onEdit,
  onDelete,
  isAuthed = false,
  linkedUserIds = new Set()
}) {
  const { theme, textTheme } = useContext(ThemeContext);

  if (!gebruikers || gebruikers.length === 0) {
    return (
      <div className={`alert alert-${theme === 'dark' ? 'dark' : 'info'} d-flex align-items-center`}>
        <IoPersonOutline className="me-2" size={18} />
        <span>Geen gebruikers gevonden.</span>
      </div>
    );
  }

  return (
    <div className={`card bg-${theme} border-0 shadow-sm`}>
      <div className="table-responsive">
        <table className={`table table-hover ${theme === 'dark' ? 'table-dark' : ''} mb-0`}>
          <thead className={theme === 'dark' ? 'bg-dark' : 'table-light'}>
            <tr>
              <th scope="col" style={{ width: '5%' }}>#</th>
              <th scope="col" style={{ width: '40%' }}>
                <div className="d-flex align-items-center">
                  <IoPersonOutline className="me-2" size={14} />
                  Naam
                </div>
              </th>
              <th scope="col" style={{ width: '40%' }}>
                <div className="d-flex align-items-center">
                  <IoShieldOutline className="me-2" size={14} />
                  Rollen
                </div>
              </th>
              {isAuthed && <th scope="col" style={{ width: '15%' }} className="text-end">Acties</th>}
            </tr>
          </thead>
          <tbody>
            {gebruikers.map(gebruiker => {
              const isLinkedToEvenement = linkedUserIds?.has(gebruiker.id?.toString()) || false;
              
              return (
                <Gebruiker
                  key={gebruiker.id}
                  id={gebruiker.id}
                  naam={gebruiker.naam}
                  roles={gebruiker.roles}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isAuthed={isAuthed}
                  isLinkedToEvenement={isLinkedToEvenement}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
  