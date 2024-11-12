import EvenementenTabel from '../../components/evenementen/EvenementenTabel';
import { useState, useMemo, useCallback } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { getAll, deleteById } from '../../api';
import AsyncData from '../../components/AsyncData';
import { Link } from 'react-router-dom';

export default function EvenementenLijst() {

  const [text, setText] = useState('');
  const [search, setSearch] = useState('');

  const {
    data: evenementen = [],
    isLoading,
    error,
  } = useSWR('evenementen', getAll);

  const { trigger: deleteEvenement, error: deleteError } = useSWRMutation(
    'evenementen',
    deleteById,
  );

  const filteredEvenementen = useMemo(
    () =>
      evenementen.filter((t) => {
        return t.naam.toLowerCase().includes(search.toLowerCase());
      }),
    [search, evenementen],
  );

  const handleDeleteEvenement = useCallback(async (id) => {
    await deleteEvenement(id);
    alert('Transaction is removed');
  }, [deleteEvenement]);

  return (
    <>
      <h1 className='text-light'>Evenementen</h1>
      <div className='input-group mb-3 w-50'>
        <input
          type="search"
          id='search'
          className='form-control rounded'
          placeholder='Zoeken'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type='button'
          className='btn btn-outline-primary'
          onClick={() => setSearch(text)}
        >
          Zoeken
        </button>
        <div className='clearfix'>
          <Link to='/evenementen/add' className='btn btn-primary float-end'>
            Voeg een evenement toe.
          </Link>
        </div>
      </div>

      <div className='mt-4'>
        <AsyncData loading={isLoading} error={error || deleteError}>
          <EvenementenTabel evenementen={filteredEvenementen} onDelete={handleDeleteEvenement} />
        </AsyncData>
      </div>
    </>
  );
}
