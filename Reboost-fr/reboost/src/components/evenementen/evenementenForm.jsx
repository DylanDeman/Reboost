// src/components/evenements/evenementForm.jsx
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

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
};
// TODO: Plaatsnaam doorgeven ipv id
export default function EvenementForm({ plaatsen = [], evenement = EMPTY_evenement, saveEvenement }) {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    mode: 'onBlur',
    defaultValues: {
      
      naam: evenement?.naam,
      datum: todatumInputString(evenement?.datum),
      plaats_id: evenement?.plaats.id,
      auteur_id: evenement?.gebruiker.id,
    },
  });

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
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='w-50 mb-3 text-light'>
        <div className='mb-3'>
          <label htmlFor='auteur_id' className='form-label'>
            Auteur
          </label>
          <input
            {...register('auteur_id', validationRules.auteur_id)}
            id="user"
            type="number"
            className="form-control"
            placeholder="auteur_id"
            required
          />
          {errors.auteur_id && <p className="form-text text-danger">{errors.auteur_id.message}</p>}
        </div>
        <div className='mb-3'>
          <label htmlFor='datum' className='form-label'>
            Datum
          </label>
          <input
            {...register('datum', validationRules.datum)}
            id='datum'
            type='datum'
            className='form-control'
            placeholder='datum'
          />
          {errors.datum && <p className="form-text text-danger">{errors.datum.message}</p>}
        </div>
        <div className='mb-3'>
          <label htmlFor='plaats' className='form-label'>
            Plaats
          </label>
          <select
            {...register('plaats_id', validationRules.plaats)}
            id='plaats'
            className='form-select'
            required
          >
            <option value='' disabled>
              -- Select a plaats --
            </option>
            {plaatsen.map(({ id, naam }) => (
              <option key={id} value={id}>
                {naam}
              </option>
            ))}
          </select>
          {errors.plaats_id && <p className="form-text text-danger">{errors.plaats_id.message}</p>}
        </div>
        <div className='clearfix'>
          <div className='btn-group float-end'>
            <button type='submit' className='btn btn-primary'>
              {evenement?.id
                ? 'Sla evenement op'
                : 'Voeg evenement toe'}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
