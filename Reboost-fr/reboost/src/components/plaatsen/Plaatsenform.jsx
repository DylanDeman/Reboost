// src/components/evenements/evenementForm.jsx
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import LabelInput from '../LabelInput';

const EMPTY_plaats = {
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
  },
  straat: {
    required: 'Een plaats moet een straat hebben',
  },
  huisnummer: {
    required: 'Een plaats moet een huisnummer hebben',
  },
  postcode: {
    required: 'Een plaats moet een postcode hebben',
    min: { value: '1000', message: 'een postcode bestaat uit 4 getallen en is minstens 1000' },
  },
  gemeente: {
    required: 'Een plaats moet een gemeente hebben',
  },
};
export default function PlaatsenForm({ plaats = EMPTY_plaats, savePlaats }) {
  const navigate = useNavigate();

  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      naam: plaats.naam,
      straat: plaats.straat,
      huisnummer: plaats.huisnummer,
      postcode: plaats.postcode,
      gemeente: plaats.gemeente,

    },
  });

  const {
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = methods;

  const onSubmit = async (values) => {
    console.log('Submitted values:', values);
    if (!isValid) return;
    await savePlaats({
      id: plaats?.id,
      ...values,
    }, {
      throwOnError: false,
      onSuccess: () => navigate('/plaatsen'),
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className='mb-5'>
        <LabelInput
          label='Naam'
          name='naam'
          type='text'
          validationRules={validationRules.naam}
          data-cy='evenementNaam_input'
        />
        <LabelInput
          label='Straat'
          name='straat'
          type='text'
          validationRules={validationRules.straat}
          data-cy='straat_input'
        />
        <LabelInput
          label='Huisnummer'
          name='huisnummer'
          type='text'
          validationRules={validationRules.huisnummer}
          data-cy='huisnummer_input'
        />
        <LabelInput
          label='Postcode'
          name='postcode'
          type='text'
          validationRules={validationRules.postcode}
          data-cy='postcode_input'
        />
        <LabelInput
          label='Gemeente'
          name='gemeente'
          type='text'
          validationRules={validationRules.gemeente}
          data-cy='gemeente_input'
        />

        <div className='clearfix'>
          <div className='btn-group float-end'>
            <button
              type='submit'
              className='btn bg-color'
              data-cy='submit_evenement'
              disabled={isSubmitting}
            >
              {plaats?.id ? 'Sla plaats op' : 'Voeg plaats toe'}
            </button>
            <Link
              disabled={isSubmitting}
              className='btn btn-light'
              to='/plaatsen'
            >
              Annuleren
            </Link>
          </div>
        </div>
      </form>
    </FormProvider>
  );

}
