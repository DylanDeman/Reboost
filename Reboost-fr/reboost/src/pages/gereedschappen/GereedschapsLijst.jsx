import GereedschappenTabel from '../../components/gereedschappen/GereedschappenTabel.jsx';
import { useState, useMemo, useCallback, useContext } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { getAll, deleteById, getById } from '../../api';
import AsyncData from '../../components/AsyncData';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../contexts/Theme.context';
import {
  IoConstructOutline,
  IoFunnelOutline,
  IoAddOutline,
  IoCloseOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline
} from 'react-icons/io5';

export default function GereedschapLijst() {
  const { theme, textTheme } = useContext(ThemeContext);

  const [filters, setFilters] = useState({
    naam: '',
    beschrijving: '',
    beschikbaar: '',
    evenement: ''
  });

  const {
    data: gereedschappen = [],
    isLoading,
    error,
  } = useSWR('gereedschap', getAll);

  const { trigger: deleteGereedschap, error: deleteError } = useSWRMutation(
    'gereedschap',
    deleteById,
  );

  const {trigger: getGereedschap, id: id} = useSWRMutation(
    'gereedschap',
    getById,
  );

  // Generate filter options for evenementen
  const filterOptions = useMemo(() => {
    const evenementen = [...new Set(
      gereedschappen
        .filter(g => g.evenement?.naam)
        .map(g => g.evenement.naam)
    )].sort();
    return { evenementen };
  }, [gereedschappen]);

  const filteredGereedschappen = useMemo(() => {
    return gereedschappen.filter((gereedschap) => {
      const matchNaam = gereedschap.naam.toLowerCase().includes(filters.naam.toLowerCase());
      const matchBeschrijving = gereedschap.beschrijving.toLowerCase().includes(filters.beschrijving.toLowerCase());
      const matchBeschikbaar =
        filters.beschikbaar === '' ||
        (filters.beschikbaar === 'true' && gereedschap.beschikbaar) ||
        (filters.beschikbaar === 'false' && !gereedschap.beschikbaar);

      const matchEvenement =
        filters.evenement === '' ||
        (filters.evenement === 'null' && !gereedschap.evenement) ||
        (gereedschap.evenement?.naam.toLowerCase() === filters.evenement.toLowerCase());

      return matchNaam && matchBeschrijving && matchBeschikbaar && matchEvenement;
    });
  }, [filters, gereedschappen]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      naam: '',
      beschrijving: '',
      beschikbaar: '',
      evenement: ''
    });
  };



  const hasActiveFilters = Object.values(filters).some(filter => filter !== '');

 const handleDeleteGereedschap = useCallback(
  async (id) => {
    try {
      const gereedschap = await getGereedschap(id); 

      if (gereedschap.evenement_id) {
        return; 
      }

      await deleteGereedschap(id);
    } catch (error) {
      console.error('Fout bij verwijderen:', error);
    }
  },
  [deleteGereedschap],
);


  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <IoConstructOutline className="me-2 text-primary" size={32} />
          <h1 className={`mb-0 text-${textTheme}`}>Gereedschappen</h1>
        </div>
        <Link to='/gereedschappen/add' className='btn btn-primary d-flex align-items-center'>
          <IoAddOutline className="me-2" size={18} />
          Nieuw gereedschap
        </Link>
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
            <div className="col-md-6 col-lg-3">
              <label className={`form-label small fw-medium text-${textTheme}`}>
                <IoConstructOutline className="me-1" size={14} />
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

            {/* Description Filter */}
            <div className="col-md-6 col-lg-3">
              <label className={`form-label small fw-medium text-${textTheme}`}>
                Beschrijving
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Zoek op beschrijving..."
                value={filters.beschrijving}
                onChange={(e) => handleFilterChange('beschrijving', e.target.value)}
                data-cy="filter_beschrijving"
              />
            </div>

            {/* Available Filter */}
            <div className="col-md-6 col-lg-2">
              <label className={`form-label small fw-medium text-${textTheme}`}>
                Beschikbaarheid
              </label>
              <select
                className="form-select form-select-sm"
                value={filters.beschikbaar}
                onChange={(e) => handleFilterChange('beschikbaar', e.target.value)}
                data-cy="filter_beschikbaar"
              >
                <option value="">Alle items</option>
                <option value="true">Beschikbaar</option>
                <option value="false">Niet beschikbaar</option>
              </select>
            </div>

            {/* Event Filter */}
            <div className="col-md-6 col-lg-4">
              <label className={`form-label small fw-medium text-${textTheme}`}>
                Evenement
              </label>
              <select
                className="form-select form-select-sm"
                value={filters.evenement}
                onChange={(e) => handleFilterChange('evenement', e.target.value)}
                data-cy="filter_evenement"
              >
                <option value="">Alle evenementen</option>
                <option value="null">Geen evenement</option>
                {filterOptions.evenementen.map(evenement => (
                  <option key={evenement} value={evenement}>{evenement}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count and stats */}
          <div className="mt-3 pt-3 border-top">
            <div className="row">
              <div className="col-md-6">
                <small className={`text-${textTheme} opacity-75`}>
                  {filteredGereedschappen.length} van {gereedschappen.length} items
                  {hasActiveFilters && ' (gefilterd)'}
                </small>
              </div>
              <div className="col-md-6 text-end">
                <small className="d-flex justify-content-end gap-3">
                  <span className="text-success d-flex align-items-center">
                    <IoCheckmarkCircleOutline className="me-1" size={14} />
                    {filteredGereedschappen.filter(g => g.beschikbaar).length} beschikbaar
                  </span>
                  <span className="text-danger d-flex align-items-center">
                    <IoCloseCircleOutline className="me-1" size={14} />
                    {filteredGereedschappen.filter(g => !g.beschikbaar).length} in gebruik
                  </span>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <AsyncData loading={isLoading} error={error || deleteError}>
        <GereedschappenTabel
          gereedschappen={filteredGereedschappen}
          onDelete={handleDeleteGereedschap}
        />
      </AsyncData>
    </div>
  );
}
