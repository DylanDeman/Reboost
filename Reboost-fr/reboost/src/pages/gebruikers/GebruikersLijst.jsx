import React, { useState, useMemo, useContext } from 'react';
import useSWR from 'swr';
import { getAll, save, deleteById } from '../../api';
import { ThemeContext } from '../../contexts/Theme.context';
import { useAuth } from '../../contexts/auth';
import AsyncData from '../../components/AsyncData';
import GebruikersTabel from '../../components/gebruikers/GebruikersTabel';
import GebruikerForm from '../../components/gebruikers/Gebruikerform';
import TooltipEffect from '../../components/TooltipEffect';
import {
  IoPersonOutline,
  IoFunnelOutline,
  IoAddOutline,
  IoCloseOutline,
  IoShieldOutline,
  IoTrashOutline,
  IoAlertCircleOutline
} from 'react-icons/io5';

const RESOURCES = {
  gebruikers: 'gebruikers',
  evenementen: 'evenementen'
};

export default function GebruikersLijst() {
  const { isAuthed } = useAuth();
  const { theme, textTheme } = useContext(ThemeContext);
  

  const [editingGebruiker, setEditingGebruiker] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [gebruikerToDelete, setGebruikerToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filters, setFilters] = useState({ naam: '', rol: '' });

  const { 
    data: gebruikers, 
    error: gebruikersError, 
    mutate: mutateGebruikers 
  } = useSWR(RESOURCES.gebruikers, () => getAll(RESOURCES.gebruikers));

  const { 
    data: evenementen, 
    error: evenementenError 
  } = useSWR(RESOURCES.evenementen, () => getAll(RESOURCES.evenementen));

  const isLoading = (!gebruikers && !gebruikersError) || (!evenementen && !evenementenError);
  const isError = gebruikersError || evenementenError;

  
  const linkedUserIds = useMemo(() => {
    if (!evenementen) return new Set();
    
    const linkedIds = new Set();
    
    evenementen.forEach(evenement => {
      const userArrays = ['gebruikers', 'auteurs'];
      userArrays.forEach(arrayName => {
        if (Array.isArray(evenement[arrayName])) {
          evenement[arrayName].forEach(gebruiker => {
            if (gebruiker) {
              const id = typeof gebruiker === 'object' && 'id' in gebruiker 
                ? gebruiker.id.toString() 
                : gebruiker.toString();
              linkedIds.add(id);
            }
          });
        }
      });
      
      const singleRefs = ['auteur', 'gebruiker'];
      singleRefs.forEach(refName => {
        const ref = evenement[refName];
        if (ref) {
          const id = typeof ref === 'object' && 'id' in ref 
            ? ref.id.toString() 
            : ref.toString();
          linkedIds.add(id);
        }
      });
    });
    
    return linkedIds;
  }, [evenementen]);

  const filterOptions = useMemo(() => {
    if (!gebruikers) return { rollen: [] };
    
    const rollenSet = new Set();
    gebruikers.forEach(gebruiker => {
      if (Array.isArray(gebruiker.roles)) {
        gebruiker.roles.forEach(role => rollenSet.add(role));
      }
    });
    
    return { rollen: Array.from(rollenSet).sort() };
  }, [gebruikers]);

  const gebruikersWithLinkedFlag = useMemo(() => {
    if (!gebruikers) return [];
    
    return gebruikers.map(g => ({
      ...g,
      isLinkedToEvenement: linkedUserIds.has(g.id.toString()),
    }));
  }, [gebruikers, linkedUserIds]);


  const filteredGebruikers = useMemo(() => {
    return gebruikersWithLinkedFlag.filter(gebruiker => {
      // Filter by name
      const nameMatch = (gebruiker.naam || '')
        .toLowerCase()
        .includes(filters.naam.toLowerCase());

      // Filter by role
      let roleMatch = true;
      if (filters.rol) {
        roleMatch = Array.isArray(gebruiker.roles) && 
          gebruiker.roles.some(role => 
            role.toLowerCase().includes(filters.rol.toLowerCase())
          );
      }

      return nameMatch && roleMatch;
    });
  }, [filters, gebruikersWithLinkedFlag]);


  
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => setFilters({ naam: '', rol: '' });

  const openCreateForm = () => {
    setEditingGebruiker(null);
    setFormVisible(true);
  };

  const openEditForm = (gebruiker) => {
    setEditingGebruiker(gebruiker);
    setFormVisible(true);
  };

  const closeForm = () => {
    setEditingGebruiker(null);
    setFormVisible(false);
  };

  const showDeleteConfirmation = (gebruiker) => {
    if (!gebruiker || gebruiker.id === undefined) {
      return;
    }
    
    setGebruikerToDelete({
      id: gebruiker.id,
      naam: gebruiker.naam || 'Unnamed User',
      isLinkedToEvenement: gebruiker.isLinkedToEvenement || false
    });
    
    setDeleteModalVisible(true);
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setGebruikerToDelete(null);
  };


  
  const handleSave = async (gebruikersData) => {
    try {
      await save(RESOURCES.gebruikers, { arg: gebruikersData });
      closeForm();
      await mutateGebruikers();
    } catch (err) {
      alert('Fout bij opslaan: ' + err.message);
    }
  };

  const confirmDelete = async () => {
    if (!gebruikerToDelete) return;
    
    const userId = gebruikerToDelete.id;
    if (userId === undefined) return;
    
    setIsDeleting(true);
    try {
      const idToDelete = !isNaN(userId) ? Number(userId) : userId;
      await deleteById(RESOURCES.gebruikers, { arg: idToDelete });
      await mutateGebruikers();
      setDeleteModalVisible(false);
    } catch (err) {
      alert('Fout bij verwijderen: ' + (err.message || 'Onbekende fout'));
    } finally {
      setIsDeleting(false);
      setGebruikerToDelete(null);
    }
  };

  const hasActiveFilters = Object.values(filters).some(f => f !== '');

  return (
    <div className="container-fluid">
      <TooltipEffect />
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <IoPersonOutline className="me-2 text-primary" size={32} />
          <h1 className={`mb-0 text-${textTheme}`}>Gebruikersbeheer</h1>
        </div>
        {isAuthed && (
          <button
            onClick={openCreateForm}
            className="btn btn-primary d-flex align-items-center"
            data-cy="add_gebruiker_btn"
          >
            <IoAddOutline className="me-2" size={18} />
            Nieuwe gebruiker toevoegen
          </button>
        )}
      </div>

      {/* Filter Section */}
      <div className={`card bg-${theme} border-0 shadow-sm mb-4`}>
        <div className="card-header border-0 py-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <IoFunnelOutline className="me-2 text-primary" size={20} />
              <h5 className={`mb-0 text-${textTheme}`}>Filters</h5>
              {hasActiveFilters && (
                <span className="badge bg-primary ms-2">
                  {Object.values(filters).filter(f => f !== '').length}
                </span>
              )}
            </div>
            {hasActiveFilters && (
              <button
                className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                onClick={clearFilters}
                data-cy="clear_filters_btn"
              >
                <IoCloseOutline className="me-1" size={16} />
                Wis filters
              </button>
            )}
          </div>
        </div>

        <div className="card-body">
          <div className="row g-3">
            {/* Name Filter */}
            <div className="col-md-6">
              <label className={`form-label small fw-medium text-${textTheme}`}>
                <IoPersonOutline className="me-1" size={14} />
                Naam
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Zoek op naam..."
                value={filters.naam}
                onChange={(e) => handleFilterChange('naam', e.target.value)}
                data-cy="filter_naam"
              />
            </div>

            {/* Role Filter */}
            <div className="col-md-6">
              <label className={`form-label small fw-medium text-${textTheme}`}>
                <IoShieldOutline className="me-1" size={14} />
                Rol
              </label>
              <select
                className="form-select form-select-sm"
                value={filters.rol}
                onChange={(e) => handleFilterChange('rol', e.target.value)}
                data-cy="filter_rol"
              >
                <option value="">Alle rollen</option>
                {filterOptions.rollen.map((rol) => (
                  <option key={rol} value={rol}>
                    {rol}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-3 pt-3 border-top">
            <small className={`text-${textTheme} opacity-75`}>
              {filteredGebruikers?.length || 0} van {gebruikers?.length || 0} gebruikers
              {hasActiveFilters && ' (gefilterd)'}
            </small>
          </div>
        </div>
      </div>

      {/* Results */}
      <AsyncData loading={isLoading} error={isError}>
        <GebruikersTabel
          gebruikers={filteredGebruikers}
          onEdit={openEditForm}
          onDelete={showDeleteConfirmation}
          isAuthed={isAuthed}
          linkedUserIds={linkedUserIds}
        />
      </AsyncData>

      {/* User Form Modal */}
      {formVisible && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content bg-${theme}`}>
              <div className="modal-header">
                <h5 className={`modal-title text-${textTheme}`}>
                  {editingGebruiker
                    ? `Gebruiker ${editingGebruiker.naam} bewerken`
                    : 'Nieuwe gebruiker aanmaken'}
                </h5>
                <button
                  type="button"
                  className={`btn-close btn-close-${theme === 'dark' ? 'white' : 'black'}`}
                  onClick={closeForm}
                  data-cy="close_form_btn"
                ></button>
              </div>
              <div className="modal-body">
                <GebruikerForm
                  onCancel={closeForm}
                  onSave={handleSave}
                  gebruiker={editingGebruiker}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalVisible && gebruikerToDelete && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} data-cy="delete_confirmation_modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content bg-${theme}`}>
              <div className="modal-header">
                <h5 className={`modal-title text-${textTheme}`}>
                  <IoAlertCircleOutline className="me-2 text-danger" size={20} />
                  Gebruiker verwijderen
                </h5>
                <button
                  type="button"
                  className={`btn-close btn-close-${theme === 'dark' ? 'white' : 'black'}`}
                  onClick={cancelDelete}
                  data-cy="cancel_delete_btn"
                ></button>
              </div>
              <div className="modal-body">
                <p className={`text-${textTheme}`}>
                  Weet je zeker dat je de gebruiker <strong>{gebruikerToDelete?.naam}</strong> wilt verwijderen?
                </p>
                {gebruikerToDelete?.isLinkedToEvenement && (
                  <div className="alert alert-warning">
                    <small>
                      Let op: Deze gebruiker is gekoppeld aan één of meer evenementen. 
                      Het verwijderen kan gevolgen hebben voor deze evenementen.
                    </small>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={cancelDelete}
                  data-cy="cancel_delete_btn_1" 
                >
                  Annuleren
                </button>
                <button
                  type="button" 
                  className="btn btn-danger d-flex align-items-center"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  data-cy="confirm_delete_btn"
                >
                  {isDeleting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Verwijderen...
                    </>
                  ) : (
                    <>
                      <IoTrashOutline className="me-2" size={18} />
                      Verwijderen
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
