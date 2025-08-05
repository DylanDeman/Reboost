// src/components/plaatsen/PlaatsenForm.jsx
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { ThemeContext } from '../../contexts/Theme.context';
import LabelInput from '../LabelInput';
import {
  IoLocationOutline,
  IoCheckmarkDoneOutline,
  IoCloseOutline,
} from 'react-icons/io5';

const EMPTY_PLAATS = {
  id: undefined,
  naam: '',
  straat: '',
  huisnummer: '',
  postcode: '',
  gemeente: '',
};

const validationRules = {
  naam: {
    required: 'Een plaats moet een naam hebben',
    minLength: { value: 2, message: 'Naam moet minstens 2 karakters lang zijn' },
  },
  straat: {
    required: 'Een plaats moet een straat hebben',
    minLength: { value: 2, message: 'Straat moet minstens 2 karakters lang zijn' },
  },
  huisnummer: {
    required: 'Een plaats moet een huisnummer hebben',
    pattern: { value: /^[0-9]+[a-zA-Z]*$/, message: 'Voer een geldig huisnummer in' },
  },
  postcode: {
    required: 'Een plaats moet een postcode hebben',
    pattern: { value: /^[1-9][0-9]{3}$/, message: 'Voer een geldige postcode in (4 cijfers, begint niet met 0)' },
  },
  gemeente: {
    required: 'Een plaats moet een gemeente hebben',
    minLength: { value: 2, message: 'Gemeente moet minstens 2 karakters lang zijn' },
  },
};

export default function PlaatsenForm({ plaats = EMPTY_PLAATS, savePlaats, isEdit = false }) {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      naam: plaats?.naam || '',
      straat: plaats?.straat || '',
      huisnummer: plaats?.huisnummer || '',
      postcode: plaats?.postcode || '',
      gemeente: plaats?.gemeente || '',
    },
  });

  const {
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = methods;

  useEffect(() => {
    if (plaats && isEdit) {
      reset({
        naam: plaats.naam || '',
        straat: plaats.straat || '',
        huisnummer: plaats.huisnummer || '',
        postcode: plaats.postcode || '',
        gemeente: plaats.gemeente || '',
      });
    }
  }, [plaats, isEdit, reset]);

  const onSubmit = async (values) => {
    if (!isValid) return;

    const submitData = {
      id: plaats?.id,
      ...values,
    };

    await savePlaats(submitData, {
      throwOnError: false,
      onSuccess: () => {
        navigate('/plaatsen');
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
                {renderLabel(IoCheckmarkDoneOutline, 'Naam')}
                <LabelInput
                  name="naam"
                  type="text"
                  placeholder="Voer de naam van de plaats in"
                  validationRules={validationRules.naam}
                  data-cy="plaats_naam_input"
                  isInvalid={!!errors.naam}
                />
              </div>

              <div className="mb-4">
                {renderLabel(IoLocationOutline, 'Straat')}
                <LabelInput
                  name="straat"
                  type="text"
                  placeholder="Voer de straatnaam in"
                  validationRules={validationRules.straat}
                  data-cy="straat_input"
                  isInvalid={!!errors.straat}
                />
              </div>

              <div className="mb-4">
                {renderLabel(IoLocationOutline, 'Huisnummer')}
                <LabelInput
                  name="huisnummer"
                  type="text"
                  placeholder="Bijv. 123 of 123A"
                  validationRules={validationRules.huisnummer}
                  data-cy="huisnummer_input"
                  isInvalid={!!errors.huisnummer}
                />
              </div>

              <div className="mb-4">
                {renderLabel(IoLocationOutline, 'Postcode')}
                <LabelInput
                  name="postcode"
                  type="text"
                  placeholder="Bijv. 1000"
                  validationRules={validationRules.postcode}
                  data-cy="postcode_input"
                  isInvalid={!!errors.postcode}
                />
              </div>

              <div className="mb-5">
                {renderLabel(IoLocationOutline, 'Gemeente')}
                <LabelInput
                  name="gemeente"
                  type="text"
                  placeholder="Voer de gemeente in"
                  validationRules={validationRules.gemeente}
                  data-cy="gemeente_input"
                  isInvalid={!!errors.gemeente}
                />
              </div>

              <div className="d-flex justify-content-end gap-3">
                <Link
                  to="/plaatsen"
                  className={`btn btn-outline-${theme === 'dark' ? 'light' : 'dark'} d-flex align-items-center gap-2`}
                  data-cy="plaats_cancel_btn"
                >
                  <IoCloseOutline size={18} />
                  Annuleren
                </Link>

                <button
                  type="submit"
                  className={`btn btn-outline-${theme === 'dark' ? 'light' : 'dark'} d-flex align-items-center gap-2`}
                  data-cy="submit_plaats"
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
                      {isEdit ? 'Sla plaats op' : 'Voeg plaats toe'}
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
