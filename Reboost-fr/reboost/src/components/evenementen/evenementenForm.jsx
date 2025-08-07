// src/components/evenements/EvenementForm.jsx
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../contexts/Theme.context';
import LabelInput from '../LabelInput';
import SelectList from '../SelectList';
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoPersonOutline,
  IoCheckmarkDoneOutline,
  IoCloseOutline,
  IoConstructOutline,
  IoTrashOutline,
} from 'react-icons/io5';

const EMPTY_EVENEMENT = {
  id: undefined,
  naam: '',
  datum: new Date(),
  gebruiker: { id: '', naam: '' },
  plaats: { id: '', naam: '' },
  gereedschappen: [],
};

const todatumInputString = (datum) => {
  if (!datum) return null;
  if (typeof datum !== 'object') {
    datum = new Date(datum);
  }
  return datum.toISOString().substring(0, 10);
};

const validationRules = {
  naam: {
    required: 'Een evenement moet een naam hebben',
    minLength: { value: 2, message: 'Naam moet minstens 2 karakters lang zijn' },
  },
  datum: {
    required: 'Een evenement moet een datum hebben',
    valueAsDate: true,
  },
  plaats_id: {
    required: 'Een evenement moet een plaats hebben',
    min: { value: 1, message: 'Selecteer een geldige plaats' },
  },
  auteur_id: {
    required: 'Een evenement moet een auteur hebben',
    min: { value: 1, message: 'Selecteer een geldige auteur' },
  },
};

export default function EvenementForm({
  gebruikers = [],
  plaatsen = [],
  gereedschappen = [],
  evenement = EMPTY_EVENEMENT,
  saveEvenement,
  isEdit = false,
}) {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const [selectedGereedschappen, setSelectedGereedschappen] = useState([]);
  const [availableGereedschappen, setAvailableGereedschappen] = useState([]);

  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      naam: evenement?.naam || '',
      datum: todatumInputString(evenement?.datum),
      plaats_id: evenement?.plaats?.id || '',
      auteur_id: evenement?.gebruiker?.id || '',
    },
  });

  const {
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = methods;

  useEffect(() => {
    if (evenement && isEdit) {
      reset({
        naam: evenement.naam || '',
        datum: todatumInputString(evenement.datum),
        plaats_id: evenement.plaats?.id || '',
        auteur_id: evenement.gebruiker?.id || '',
      });
      setSelectedGereedschappen(evenement.gereedschappen || []);
    }
  }, [evenement, isEdit, reset]);

  useEffect(() => {
    const available = gereedschappen.filter(
      (tool) => !selectedGereedschappen.some((selected) => selected.id === tool.id)
    );
    setAvailableGereedschappen(available);
  }, [gereedschappen, selectedGereedschappen]);

  const onSubmit = async (values) => {
    if (!isValid) return;

    const submitData = {
      id: evenement?.id,
      ...values,
      plaats_id: values.plaats_id === '' ? null : parseInt(values.plaats_id) || null,
      auteur_id: values.auteur_id === '' ? null : parseInt(values.auteur_id) || null,
      gereedschap_ids: selectedGereedschappen.map((tool) => tool.id),
    };

    await saveEvenement(submitData, {
      throwOnError: false,
      onSuccess: () => {
        navigate('/evenementen');
      },
    });
  };

  const renderLabel = (IconComponent, labelText) => (
    <label className="form-label d-flex align-items-center gap-2">
      <IconComponent size={20} />
      {labelText}
    </label>
  );

  const handleRemoveGereedschap = (gereedschapId) => {
    setSelectedGereedschappen((prev) => prev.filter((tool) => tool.id !== gereedschapId));
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="mb-4">
                {renderLabel(IoCheckmarkDoneOutline, 'Naam')}
                <LabelInput
                  name="naam"
                  type="text"
                  placeholder="Voer de naam van het evenement in"
                  validationRules={validationRules.naam}
                  data-cy="evenementNaam_input"
                  isInvalid={!!errors.naam}
                />
              </div>

              <div className="mb-4">
                {renderLabel(IoCalendarOutline, 'Datum')}
                <LabelInput
                  name="datum"
                  type="date"
                  validationRules={validationRules.datum}
                  data-cy="datum_input"
                  isInvalid={!!errors.datum}
                />
              </div>

              <div className="mb-4">
                {renderLabel(IoLocationOutline, 'Plaats')}
                <SelectList
                  name="plaats_id"
                  placeholder="-- Selecteer een plaats --"
                  items={plaatsen}
                  validationRules={validationRules.plaats_id}
                  data-cy="plaats_input"
                  isInvalid={!!errors.plaats_id}
                />
              </div>

              <div className="mb-4">
                {renderLabel(IoPersonOutline, 'Auteur')}
                <SelectList
                  name="auteur_id"
                  placeholder="-- Selecteer een auteur --"
                  items={gebruikers}
                  validationRules={validationRules.auteur_id}
                  data-cy="auteur_input"
                  isInvalid={!!errors.auteur_id}
                />
              </div>

              <div className="mb-5">
                {renderLabel(IoConstructOutline, 'Gereedschappen')}

                {availableGereedschappen.length > 0 ? (
                  <select
                    multiple
                    className={`form-select ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}
                    size={Math.min(availableGereedschappen.length, 5)}
                    data-cy="gereedschap_multiselect"
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions).map((opt) =>
                        parseInt(opt.value)
                      );
                      const newSelected = availableGereedschappen.filter((tool) =>
                        selectedOptions.includes(tool.id)
                      );
                      setSelectedGereedschappen((prev) => {
                        const prevIds = prev.map((t) => t.id);
                        const combined = [...prev];
                        newSelected.forEach((tool) => {
                          if (!prevIds.includes(tool.id)) combined.push(tool);
                        });
                        return combined;
                      });
                      e.target.selectedIndex = -1;
                    }}
                  >
                    {availableGereedschappen.map((tool) => (
                      <option key={tool.id} value={tool.id}>
                        {tool.naam}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className={`text-muted p-3 border rounded text-center`}>
                    <IoConstructOutline size={24} className="mb-2" />
                    <p className="mb-0">Geen gereedschappen beschikbaar om toe te voegen</p>
                  </div>
                )}

                {selectedGereedschappen.length > 0 ? (
                  <div className="border rounded p-3 mt-3">
                    <h6 className="mb-3">Geselecteerde gereedschappen:</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {selectedGereedschappen.map((tool) => (
                        <div
                          key={tool.id}
                          className={`badge bg-${theme === 'dark' ? 'secondary' : 'primary'} d-flex align-items-center gap-2 p-2 fs-6`}
                          data-cy={`selected_gereedschap_${tool.id}`}
                        >
                          <span>{tool.naam}</span>
                          <button
                            type="button"
                            className="btn-close btn-close-white"
                            style={{ fontSize: '0.8rem' }}
                            onClick={() => handleRemoveGereedschap(tool.id)}
                            data-cy={`remove_gereedschap_${tool.id}`}
                            aria-label={`Verwijder ${tool.naam}`}
                          >
                            <IoTrashOutline size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    className={`p-3 border rounded text-center mt-3 ${
                      theme === 'dark' ? 'bg-dark text-light border-secondary' : ''
                    }`}
                  >
                    <IoConstructOutline size={24} className="mb-2" />
                    <p className="mb-0">Geen gereedschappen geselecteerd</p>
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-end gap-3">
                <Link
                  to="/evenementen"
                  className={`btn btn-outline-${theme === 'dark' ? 'light' : 'dark'} d-flex align-items-center gap-2`}
                  data-cy="evenement_cancel_btn"
                >
                  <IoCloseOutline size={18} />
                  Annuleren
                </Link>

                <button
                  type="submit"
                  className={`btn btn-outline-${theme === 'dark' ? 'light' : 'dark'} d-flex align-items-center gap-2`}
                  data-cy="submit_evenement"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm"></span>
                      Opslaan...
                    </>
                  ) : (
                    <>
                      <IoCheckmarkDoneOutline size={18} />
                      {isEdit ? 'Sla evenement op' : 'Voeg evenement toe'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
