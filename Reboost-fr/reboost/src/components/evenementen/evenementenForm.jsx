// src/components/evenements/EvenementForm.jsx
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { ThemeContext } from '../../contexts/Theme.context';
import LabelInput from '../LabelInput';
import SelectList from '../SelectList';
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoPersonOutline,
  IoCheckmarkDoneOutline,
  IoCloseOutline,
} from 'react-icons/io5';

const EMPTY_EVENEMENT = {
  id: undefined,
  naam: '',
  datum: new Date(),
  gebruiker: { id: '', naam: '' },
  plaats: { id: '', naam: '' },
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
  evenement = EMPTY_EVENEMENT,
  saveEvenement,
  isEdit = false,
}) {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

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
    }
  }, [evenement, isEdit, reset]);

  const onSubmit = async (values) => {
    if (!isValid) return;

    const submitData = {
      id: evenement?.id,
      ...values,
      plaats_id: values.plaats_id === '' ? null : parseInt(values.plaats_id) || null,
      auteur_id: values.auteur_id === '' ? null : parseInt(values.auteur_id) || null,
    };

    await saveEvenement(submitData, {
      throwOnError: false,
      onSuccess: () => {
        navigate('/evenementen');
      },
    });
  };

  // Helper to render label with icon
  const renderLabel = (IconComponent, labelText) => (
    <label className="form-label d-flex align-items-center gap-2">
      <IconComponent size={20} />
      {labelText}
    </label>
  );

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
                {errors.naam && (
                  <div className="invalid-feedback d-block">{errors.naam.message}</div>
                )}
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
                {errors.datum && (
                  <div className="invalid-feedback d-block">{errors.datum.message}</div>
                )}
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
                {errors.plaats_id && (
                  <div className="invalid-feedback d-block">{errors.plaats_id.message}</div>
                )}
              </div>

              <div className="mb-5">
                {renderLabel(IoPersonOutline, 'Auteur')}
                <SelectList
                  name="auteur_id"
                  placeholder="-- Selecteer een auteur --"
                  items={gebruikers}
                  validationRules={validationRules.auteur_id}
                  data-cy="auteur_input"
                  isInvalid={!!errors.auteur_id}
                />
                {errors.auteur_id && (
                  <div className="invalid-feedback d-block">{errors.auteur_id.message}</div>
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
