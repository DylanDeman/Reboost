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
    <div className="container-fluid py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-8">
          {/* Header Section */}
          <div className="text-center mb-5">
            <h1 className={`display-5 fw-bold text-${textTheme} mb-3`}>
              {isEdit ? 'Gereedschap bewerken' : 'Nieuw gereedschap'}
            </h1>
            <p className={`fs-5 text-${textTheme === 'light' ? 'muted' : 'light'} mb-0`}>
              {isEdit ? 'Wijzig de gegevens van het gereedschap' : 'Voeg nieuw gereedschap toe aan je inventaris'}
            </p>
          </div>

          {/* Form Section */}
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="row g-4">
                  
                  {/* Name Field */}
                  <div className="col-12">
                    <LabelInput
                      label="Naam"
                      name="naam"
                      type="text"
                      placeholder="Voer de naam van het gereedschap in"
                      validationRules={validationRules.naam}
                      data-cy="gereedschap_naam_input"
                    />
                  </div>

                  {/* Description Field */}
                  <div className="col-12">
                    <LabelInput
                      label="Beschrijving"
                      name="beschrijving"
                      type="textarea"
                      placeholder="Beschrijf het gereedschap in detail..."
                      rows={4}
                      validationRules={validationRules.beschrijving}
                      data-cy="gereedschap_beschrijving_input"
                    />
                  </div>

                  {/* Two Column Section */}
                  <div className="col-md-6">
                    <div className="h-100 d-flex flex-column justify-content-center">
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
                      <small className={`form-text text-${textTheme === 'light' ? 'muted' : 'light'} mt-1`}>
                        Schakel in als het gereedschap beschikbaar is
                      </small>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <SelectList
                      label="Gekoppeld evenement"
                      name="evenementId"
                      placeholder="-- Selecteer een evenement --"
                      items={evenementen.map(evenement => ({
                        id: evenement.id,
                        naam: `${evenement.naam} - ${new Date(evenement.datum).toLocaleDateString('nl-NL')}`,
                      }))}
                      validationRules={validationRules.evenementId}
                      data-cy="gereedschap_evenement_select"
                    />
                    <small className={`form-text text-${textTheme === 'light' ? 'muted' : 'light'} mt-1`}>
                      Optioneel: koppel aan een evenement
                    </small>
                  </div>

                  {/* Action Buttons */}
                  <div className="col-12 pt-4">
                    <hr className={`border-${textTheme === 'light' ? 'secondary' : 'light'} opacity-25 my-4`} />
                    <div className="d-flex flex-column flex-sm-row gap-3 justify-content-end">
                      <Link
                        className={`btn btn-outline-${textTheme === 'light' ? 'secondary' : 'light'} btn-lg px-4 order-2 order-sm-1`}
                        to="/gereedschappen"
                        data-cy="gereedschap_cancel_btn"
                      >
                        <i className="bi bi-x-circle me-2"></i>
                        Annuleren
                      </Link>
                      <button
                        type="submit"
                        className={`btn btn-${theme} btn-lg px-4 fw-semibold order-1 order-sm-2`}
                        data-cy="gereedschap_submit_btn"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Bezig met opslaan...
                          </>
                        ) : (
                          <>
                            <i className={`bi ${isEdit ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
                            {isEdit ? 'Bijwerken' : 'Toevoegen'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}