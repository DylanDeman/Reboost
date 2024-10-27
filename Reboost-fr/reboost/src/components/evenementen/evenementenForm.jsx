// src/components/Evenements/EvenementForm.jsx
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const EMPTY_EVENEMENT = {
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
    datum = new datum(datum);
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
    valueAsdatum: true,
  },
  plaats_id: {
    required: 'Een evenement moet een plaats hebben',
  },
};

export default function EvenementForm({ plaatsen = [], Evenement = EMPTY_EVENEMENT, saveEvenement }) {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    mode: 'onBlur',
    defaultValues: {
      datum: todatumInputString(Evenement?.datum),
      plaats_id: Evenement?.plaats.id,
      amount: Evenement?.amount,
      auteur_id: Evenement?.gebruiker.id,
    },
  });

  const onSubmit = async (values) => {
    if (!isValid) return;
    await saveEvenement({
      id: Evenement?.id,
      ...values,
    }, {
      throwOnError: false,
      onSuccess: () => navigate('/Evenements'),
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='w-50 mb-3'>
        <div className='mb-3'>
          <label htmlFor='auteur_id' className='form-label'>
            Auteurs Id
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
            datum
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
          <label htmlFor='plaatss' className='form-label'>
            plaats
          </label>
          <select
            {...register('plaats_id', validationRules.plaats)}
            id='plaatss'
            className='form-select'
            required
          >
            <option value='' disabled>
              -- Select a plaats --
            </option>
            {plaatsen.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
          {errors.plaats_id && <p className="form-text text-danger">{errors.plaats_id.message}</p>}
        </div>
        <div className='clearfix'>
          <div className='btn-group float-end'>
            <button type='submit' className='btn btn-primary'>
              {Evenement?.id
                ? 'Save Evenement'
                : 'Add Evenement'}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
