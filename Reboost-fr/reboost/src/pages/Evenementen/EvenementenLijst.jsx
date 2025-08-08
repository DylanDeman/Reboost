import EvenementenTabel from '../../components/evenementen/EvenementenTabel';
import { useState, useMemo, useContext } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { getAll, deleteById, getById, save } from '../../api';
import AsyncData from '../../components/AsyncData';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../contexts/Theme.context';
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoPersonOutline,
  IoFunnelOutline,
  IoAddOutline,
  IoCloseOutline,
} from 'react-icons/io5';



export default function EvenementenLijst() {
  const { theme, textTheme } = useContext(ThemeContext);

  // Filter states
  const [filters, setFilters] = useState({
    naam: '',
    plaats: '',
    auteur: '',
    datumVan: '',
    datumTot: '',
  });

  const {
    data: evenementen = [],
    isLoading,
    error,
    mutate: mutateEvenementen,
  } = useSWR('evenementen', getAll);

  const { trigger: triggerDelete, error: deleteError } = useSWRMutation(
    'evenementen',
    deleteById,
  );

  // Get unique values for filter dropdowns
  const filterOptions = useMemo(() => {
    const plaatsen = [...new Set(evenementen.map((e) => e.plaats.naam))].sort();
    const auteurs = [...new Set(evenementen.map((e) => e.auteur.naam))].sort();
    return { plaatsen, auteurs };
  }, [evenementen]);

  const filteredEvenementen = useMemo(() => {
    return evenementen.filter((evenement) => {
      const eventDate = new Date(evenement.datum);
      const fromDate = filters.datumVan ? new Date(filters.datumVan) : null;
      const toDate = filters.datumTot ? new Date(filters.datumTot) : null;

      return (
        evenement.naam.toLowerCase().includes(filters.naam.toLowerCase()) &&
        evenement.plaats.naam.toLowerCase().includes(filters.plaats.toLowerCase()) &&
        evenement.auteur.naam.toLowerCase().includes(filters.auteur.toLowerCase()) &&
        (!fromDate || eventDate >= fromDate) &&
        (!toDate || eventDate <= toDate)
      );
    });
  }, [filters, evenementen]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      naam: '',
      plaats: '',
      auteur: '',
      datumVan: '',
      datumTot: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some((filter) => filter !== '');
async function handleDeleteEvenement(id) {
  try {
    const evenement = await getById(`evenementen/${id}`);
    const linkedGereedschap = evenement.gereedschappen || [];

    await Promise.all(
      linkedGereedschap.map((g) =>
        save('gereedschap', { arg: { id: g.id, beschikbaar: true, evenementId: null } }),
      ),
    );

    await triggerDelete(id); // <-- pass only id here

    mutateEvenementen();
  } catch (err) {
    console.error('Failed to delete event and reset gereedschap', err);
  }
}



  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <IoCalendarOutline className="me-2 text-primary" size={32} />
          <h1 className={`mb-0 text-${textTheme}`}>Evenementen</h1>
        </div>
        <Link to="/evenementen/add" className="btn btn-primary d-flex align-items-center">
          <IoAddOutline className="me-2" size={18} />
          Nieuw evenement
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
                  {Object.values(filters).filter((f) => f !== '').length}
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
            {/* Event Name Filter */}
            <div className="col-md-6 col-lg-3">
              <label className={`form-label small fw-medium text-${textTheme}`}>
                <IoCalendarOutline className="me-1" size={14} />
                Evenement naam
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

            {/* Location Filter */}
            <div className="col-md-6 col-lg-3">
              <label className={`form-label small fw-medium text-${textTheme}`}>
                <IoLocationOutline className="me-1" size={14} />
                Locatie
              </label>
              <select
                className="form-select form-select-sm"
                value={filters.plaats}
                onChange={(e) => handleFilterChange('plaats', e.target.value)}
                data-cy="filter_plaats"
              >
                <option value="">Alle locaties</option>
                {filterOptions.plaatsen.map((plaats) => (
                  <option key={plaats} value={plaats}>
                    {plaats}
                  </option>
                ))}
              </select>
            </div>

            {/* Author Filter */}
            <div className="col-md-6 col-lg-2">
              <label className={`form-label small fw-medium text-${textTheme}`}>
                <IoPersonOutline className="me-1" size={14} />
                Auteur
              </label>
              <select
                className="form-select form-select-sm"
                value={filters.auteur}
                onChange={(e) => handleFilterChange('auteur', e.target.value)}
                data-cy="filter_auteur"
              >
                <option value="">Alle auteurs</option>
                {filterOptions.auteurs.map((auteur) => (
                  <option key={auteur} value={auteur}>
                    {auteur}
                  </option>
                ))}
              </select>
            </div>

            {/* Date From Filter */}
            <div className="col-md-6 col-lg-2">
              <label className={`form-label small fw-medium text-${textTheme}`}>Datum van</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={filters.datumVan}
                onChange={(e) => handleFilterChange('datumVan', e.target.value)}
                data-cy="filter_datum_van"
              />
            </div>

            {/* Date To Filter */}
            <div className="col-md-6 col-lg-2">
              <label className={`form-label small fw-medium text-${textTheme}`}>Datum tot</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={filters.datumTot}
                onChange={(e) => handleFilterChange('datumTot', e.target.value)}
                data-cy="filter_datum_tot"
              />
            </div>
          </div>

          {/* Results count */}
          <div className="mt-3 pt-3 border-top">
            <small className={`text-${textTheme} opacity-75`}>
              {filteredEvenementen.length} van {evenementen.length} evenementen
              {hasActiveFilters && ' (gefilterd)'}
            </small>
          </div>
        </div>
      </div>

      {/* Results */}
      <AsyncData loading={isLoading} error={error || deleteError}>
        <EvenementenTabel evenementen={filteredEvenementen} onDelete={handleDeleteEvenement} />
      </AsyncData>
    </div>
  );
}
