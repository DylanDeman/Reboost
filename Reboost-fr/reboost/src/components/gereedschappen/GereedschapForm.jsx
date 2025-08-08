// src/components/gereedschap/GereedschapForm.jsx
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { ThemeContext } from '../../contexts/Theme.context';
import LabelInput from '../LabelInput';
import SelectList from '../SelectList';
import {
  IoHammerOutline,
  IoDocumentTextOutline,
  IoCalendarOutline,
  IoCheckmarkDoneOutline,
  IoCloseOutline,
} from 'react-icons/io5';

const EMPTY_GEREEDSCHAP = {
  id: undefined,
  naam: '',
  beschrijving: '',
  beschikbaar: true,
  evenement: {
    id: '',
    naam: '',
  },
};

const validationRules = {
  naam: {
    required: 'Gereedschap moet een naam hebben',
    minLength: { value: 2, message: 'Naam moet minstens 2 karakters lang zijn' },
  },
  beschrijving: {
    required: 'Gereedschap moet een beschrijving hebben',
    minLength: { value: 5, message: 'Beschrijving moet minstens 5 karakters lang zijn' },
  },
  beschikbaar: {
    // No validation needed for boolean
  },
  evenementId: {
    // Optional, no validation needed
  },
};

const formatEvenementName = (evenement) => {
  if (!evenement) return '';
  const date = evenement.datum ? new Date(evenement.datum).toLocaleDateString('nl-NL') : '';
  return `${evenement.naam} - ${date}`;
};

export default function GereedschapForm({
  evenementen = [],
  gereedschap = EMPTY_GEREEDSCHAP,
  saveGereedschap,
  isEdit = false,
}) {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      naam: gereedschap?.naam || '',
      beschrijving: gereedschap?.beschrijving || '',
      beschikbaar: gereedschap?.beschikbaar ?? true,
      evenementId: gereedschap?.evenement?.id || '',
    },
  });

  const {
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = methods;

  // Watch evenementId to disable availability checkbox if linked
  const geselecteerdEvenementId = methods.watch('evenementId');

  useEffect(() => {
    if (gereedschap && isEdit) {
      reset({
        naam: gereedschap.naam || '',
        beschrijving: gereedschap.beschrijving || '',
        beschikbaar: gereedschap.beschikbaar ?? true,
        evenementId: gereedschap.evenement?.id || '',
      });
    }
  }, [gereedschap, isEdit, reset]);

  const onSubmit = async (values) => {
    if (!isValid) return;

    const submitData = {
      id: gereedschap?.id,
      ...values,
      evenementId: values.evenementId === '' ? null : parseInt(values.evenementId) || null,
    };

    await saveGereedschap(submitData, {
      throwOnError: false,
      onSuccess: () => {
        navigate('/gereedschappen');
      },
    });
  };

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
                {renderLabel(IoHammerOutline, 'Naam')}
                <LabelInput
                  name="naam"
                  type="text"
                  placeholder="Voer de naam van het gereedschap in"
                  validationRules={validationRules.naam}
                  data-cy="gereedschap_naam_input"
                  isInvalid={!!errors.naam}
                />
              </div>

              <div className="mb-4">
                {renderLabel(IoDocumentTextOutline, 'Beschrijving')}
                <LabelInput
                  name="beschrijving"
                  type="textarea"
                  placeholder="Beschrijf het gereedschap..."
                  rows={3}
                  validationRules={validationRules.beschrijving}
                  data-cy="gereedschap_beschrijving_input"
                  isInvalid={!!errors.beschrijving}
                />
              </div>

              <div className="mb-4">
                {renderLabel(IoCalendarOutline, 'Evenement (optioneel)')}
                <SelectList
                  name="evenementId"
                  placeholder="-- Selecteer evenement --"
                  items={[
                    { id: '', naam: 'Geen evenement' }, // <-- Add this option here
                    ...evenementen.map((e) => ({
                      id: e.id,
                      naam: formatEvenementName(e),
                    })),
                  ]}
                  validationRules={validationRules.evenementId}
                  data-cy="gereedschap_evenement_select"
                  isInvalid={!!errors.evenementId}
                />
              </div>

              <div className="mb-1 form-check form-switch">
                <input
                  type="checkbox"
                  id="beschikbaar"
                  className="form-check-input"
                  {...methods.register('beschikbaar')}
                  data-cy="gereedschap_beschikbaar_input"
                  disabled={!!geselecteerdEvenementId} // disabled if event linked
                />
                <label htmlFor="beschikbaar" className="form-check-label">
                  Beschikbaar voor gebruik
                </label>
              </div>
              {geselecteerdEvenementId && (
                <small className=" mb-4 d-block">
                  Beschikbaarheid kan niet worden aangepast wanneer een evenement is gekoppeld.
                </small>
              )}

              <div className="d-flex justify-content-end gap-3">
                <Link
                  to="/gereedschappen"
                  className={`btn btn-outline-${theme === 'dark' ? 'light' : 'dark'} d-flex align-items-center gap-2`}
                  data-cy="gereedschap_cancel_btn"
                >
                  <IoCloseOutline size={18} />
                  Annuleren
                </Link>

                <button
                  type="submit"
                  className={`btn btn-outline-${theme === 'dark' ? 'light' : 'dark'} d-flex align-items-center gap-2`}
                  data-cy="gereedschap_submit_btn"
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
                      {isEdit ? 'Opslaan' : 'Toevoegen'}
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
