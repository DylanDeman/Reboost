import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import PlaatsenCards from '../../components/plaatsen/PlaatsenCards';
import { getAll, save, deleteById } from '../../api';
import AsyncData from '../../components/AsyncData';
import { Link } from 'react-router-dom';
import { useCallback, useMemo, useState, useContext } from 'react';
import { IoFunnelOutline, IoCloseOutline } from 'react-icons/io5';
import { ThemeContext } from '../../contexts/Theme.context';

export default function PlaatsenLijst() {
  const { theme, textTheme } = useContext(ThemeContext);

  const { data: plaatsen = [], error, isLoading } = useSWR('plaatsen', getAll);
  const { trigger: deletePlaats, error: deleteError } = useSWRMutation('plaatsen', deleteById);
  const { trigger: savePlaats, error: saveError } = useSWRMutation('plaatsen', save);

  const [filters, setFilters] = useState({
    naam: '',
    gemeente: ''
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
      gemeente: ''
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
    <>
      <div className='mb-4'>
        <h1 className={`text-${textTheme}`}>Plaatsen</h1>
        <div className='clearfix mb-3'>
          <Link to='/plaatsen/add' className='btn bg-color float-start'>
            Voeg een plaats toe
          </Link>
        </div>

        {/* Filters */}
        <div className={`card bg-${theme} border-0 shadow-sm mb-4`}>
          <div className={`card-header bg-${theme} border-0 d-flex justify-content-between align-items-center`}>
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
              <div className="col-md-6">
                <label className={`form-label small fw-medium text-${textTheme}`}>Naam</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={filters.naam}
                  placeholder="Zoek op naam..."
                  onChange={(e) => handleFilterChange('naam', e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className={`form-label small fw-medium text-${textTheme}`}>Gemeente</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={filters.gemeente}
                  placeholder="Zoek op gemeente..."
                  onChange={(e) => handleFilterChange('gemeente', e.target.value)}
                />
              </div>
            </div>
            <div className="mt-3 pt-2 border-top">
              <small className={`text-${textTheme} opacity-75`}>
                {filteredPlaatsen.length} van {plaatsen.length} plaatsen getoond
                {hasActiveFilters && ' (gefilterd)'}
              </small>
            </div>
          </div>
        </div>
      </div>

      <AsyncData loading={isLoading} error={error || deleteError || saveError}>
        <PlaatsenCards
          plaatsen={filteredPlaatsen}
          onRate={savePlaats}
          onDelete={handleDeletePlaats}
        />
      </AsyncData>
    </>
  );
}
