// src/components/evenements/evenementForm.jsx
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import LabelInput from '../LabelInput';
import SelectList from '../SelectList';

const EMPTY_evenement = {
  id: undefined,
  naam: '',
  datum: new Date(),
  gebruiker: {
    id: '',
    naam: '',
  },
  plaats: {
    id: '',
    naam: '',
  },
};

const todatumInputString = (datum) => {
  if (!datum) return null;
  if (typeof datum !== Object) {
    datum = new Date(datum);
  }
  let asString = datum.toISOString();
  return asString.substring(0, asString.indexOf('T'));
};

const validationRules = {
  auteur_id: {
    required: 'Een evenement moet een auteur hebben',
    min: { value: 1, message: 'min 1' },
  },
  datum: {
    required: 'Een evenement moet een datum hebben',
    valueAsDate: true,
  },
  plaats_id: {
    required: 'Een evenement moet een plaats hebben',
  },
  evenement_naam: {
    required: 'Een evenement moet een naam hebben',
  },
};
// TODO: Plaatsnaam doorgeven ipv id
export default function EvenementForm({ plaatsen = [], evenement = EMPTY_evenement, saveEvenement }) {
  const navigate = useNavigate();

  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      date: todatumInputString(evenement?.datum),
      plaats_id: evenement?.plaats.id,
    },
  });

  const {
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = methods;

  const onSubmit = async (values) => {
    if (!isValid) return;
    await saveEvenement({
      id: evenement?.id,
      ...values,
    }, {
      throwOnError: false,
      onSuccess: () => navigate('/evenementen'),
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className='mb-5'>
        <LabelInput
          label='Naam'
          name='naam'
          type='text'
          validationRules={validationRules.evenement_naam}
          data-cy='evenementNaam_input'
        />
        <LabelInput
          label='Datum'
          name='datum'
          type='date'
          validationRules={validationRules.datum}
          data-cy='datum_input'
        />
        <SelectList
          label='Plaats'
          name='plaats_id'
          placeholder='-- Selecteer een plaats --'
          items={plaatsen}
          validationRules={validationRules.plaats_id}
          data-cy='plaats'
        />

        <div className='clearfix'>
          <div className='btn-group float-end'>
            <button
              type='submit'
              className='btn btn-primary'
              data-cy='submit_evenement'
              disabled={isSubmitting}  //TODO: Evenement editen/ toevoegen laten werken in Api
            >
              {evenement?.id ? 'Sla evenement op' : 'Voeg evenement toe'}
            </button>
            <Link
              disabled={isSubmitting}
              className='btn btn-light'
              to='/evenementen'
            >
              Annuleren
            </Link>
          </div>
        </div>
      </form>
    </FormProvider>
  );

}
