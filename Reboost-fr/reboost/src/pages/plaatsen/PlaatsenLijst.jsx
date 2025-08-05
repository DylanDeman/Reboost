import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import PlaatsenCards from '../../components/plaatsen/PlaatsenCards';
import { getAll, save, deleteById } from '../../api';
import AsyncData from '../../components/AsyncData';
import { Link } from 'react-router-dom';
import { useCallback, useMemo, useState, useContext } from 'react';
import { IoFunnelOutline, IoCloseOutline, IoAddOutline, IoLocationOutline } from 'react-icons/io5';
import { ThemeContext } from '../../contexts/Theme.context';

export default function PlaatsenLijst() {
  const { theme, textTheme } = useContext(ThemeContext);

  const { data: plaatsen = [], error, isLoading } = useSWR('plaatsen', getAll);
  const { trigger: deletePlaats, error: deleteError } = useSWRMutation('plaatsen', deleteById);
  const { trigger: savePlaats, error: saveError } = useSWRMutation('plaatsen', save);

  const [filters, setFilters] = useState({
    naam: '',
    gemeente: '',
  });

  const handleDeletePlaats = useCallback(async (id) => {
    await deletePlaats(id);
    alert('De plaats is verwijderd.');
  }, [deletePlaats]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      naam: '',
      gemeente: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(f => f !== '');

  const filteredPlaatsen = useMemo(() => {
    return plaatsen.filter((plaats) => {
      const matchNaam =
        filters.naam === '' ||
        (plaats.naam ?? '').toLowerCase().includes(filters.naam.toLowerCase());

      const matchGemeente =
        filters.gemeente === '' ||
        (plaats.gemeente ?? '').toLowerCase().includes(filters.gemeente.toLowerCase());

      return matchNaam && matchGemeente;
    });
  }, [plaatsen, filters]);

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <IoLocationOutline className="me-2 text-primary" size={32} />
          <h1 className={`mb-0 text-${textTheme}`}>Plaatsen</h1>
        </div>
        <Link to="/plaatsen/add" className="btn btn-primary d-flex align-items-center">
          <IoAddOutline className="me-2" size={18} />
          Voeg een plaats toe
        </Link>
      </div>

      {/* Filters Card */}
      <div className={`card bg-${theme} border-0 shadow-sm mb-4`}>
        <div className="card-header border-0 py-3 d-flex align-items-center justify-content-between">
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

        <div className="card-body">
          <div className="row g-3">
            {/* Naam filter */}
            <div className="col-md-6 col-lg-6">
              <label className={`form-label small fw-medium text-${textTheme}`}>
                Naam
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Zoek op naam..."
                value={filters.naam}
                onChange={e => handleFilterChange('naam', e.target.value)}
                data-cy="filter_naam"
              />
            </div>

            {/* Gemeente filter */}
            <div className="col-md-6 col-lg-6">
              <label className={`form-label small fw-medium text-${textTheme}`}>
                Gemeente
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Zoek op gemeente..."
                value={filters.gemeente}
                onChange={e => handleFilterChange('gemeente', e.target.value)}
                data-cy="filter_gemeente"
              />
            </div>
          </div>

          {/* Results count */}
          <div className="mt-3 pt-3 border-top">
            <small className={`text-${textTheme} opacity-75`}>
              {filteredPlaatsen.length} van {plaatsen.length} plaatsen
              {hasActiveFilters && ' (gefilterd)'}
            </small>
          </div>
        </div>
      </div>

      {/* Plaatsen Cards */}
      <AsyncData loading={isLoading} error={error || deleteError || saveError}>
        <PlaatsenCards plaatsen={filteredPlaatsen} onDelete={handleDeletePlaats} />
      </AsyncData>
    </div>
  );
}
