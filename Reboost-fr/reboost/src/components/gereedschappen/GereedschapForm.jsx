// src/components/gereedschap/GereedschapForm.jsx
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { ThemeContext } from '../../contexts/Theme.context';
import LabelInput from '../LabelInput';
import SelectList from '../SelectList';

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
    // Optional field, no validation needed
  },
};

export default function GereedschapForm({ 
  evenementen = [], 
  gereedschap = EMPTY_GEREEDSCHAP, 
  saveGereedschap,
  isEdit = false 
}) {
  const navigate = useNavigate();
  const { theme, textTheme } = useContext(ThemeContext);

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
    formState: { isValid, isSubmitting },
    reset,
  } = methods;

  // Reset form when gereedschap changes (for editing)
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
    console.log('Submitted values:', values);
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

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="needs-validation">
              
              <div className="mb-4">
                <LabelInput
                  label="Naam"
                  name="naam"
                  type="text"
                  placeholder="Voer de naam van het gereedschap in"
                  validationRules={validationRules.naam}
                  data-cy="gereedschap_naam_input"
                />
              </div>

              <div className="mb-4">
                <LabelInput
                  label="Beschrijving"
                  name="beschrijving"
                  type="textarea"
                  placeholder="Beschrijf het gereedschap..."
                  rows={3}
                  validationRules={validationRules.beschrijving}
                  data-cy="gereedschap_beschrijving_input"
                />
              </div>

              <div className="mb-4">
                <SelectList
                  label="Evenement (optioneel)"
                  name="evenementId"
                  placeholder="-- Selecteer evenement --"
                  items={evenementen.map(evenement => ({
                    id: evenement.id,
                    naam: `${evenement.naam} - ${new Date(evenement.datum).toLocaleDateString('nl-NL')}`,
                  }))}
                  validationRules={validationRules.evenementId}
                  data-cy="gereedschap_evenement_select"
                />
              </div>

              <div className="mb-5">
                <div className="form-check form-switch">
                  <LabelInput
                    label="Beschikbaar voor gebruik"
                    name="beschikbaar"
                    type="checkbox"
                    className="form-check-input"
                    validationRules={validationRules.beschikbaar}
                    data-cy="gereedschap_beschikbaar_input"
                  />
                </div>
              </div>

              <div className="d-flex gap-3 justify-content-end">
                <Link
                  className={`btn btn-outline-${theme === 'dark' ? 'light' : 'dark'}`}
                  to="/gereedschappen"
                  data-cy="gereedschap_cancel_btn"
                >
                  Annuleren
                </Link>

                <button
                  type="submit"
                  className={`btn btn-outline-${theme === 'dark' ? 'light' : 'dark'}`}
                  data-cy="gereedschap_submit_btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Opslaan...
                    </>
                  ) : (
                    isEdit ? 'Opslaan' : 'Toevoegen'
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