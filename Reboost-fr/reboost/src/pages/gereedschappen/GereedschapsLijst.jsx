import GereedschappenTabel from '../../components/gereedschappen/GereedschappenTabel.jsx';
import { useState, useMemo, useCallback } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { getAll, deleteById } from '../../api';
import AsyncData from '../../components/AsyncData';
import { Link } from 'react-router-dom';

export default function GereedschapLijst() {
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');

  const {
    data: gereedschappen = [],
    isLoading,
    error,
  } = useSWR('gereedschap', getAll);

  const { trigger: deleteGereedschap, error: deleteError } = useSWRMutation(
    'gereedschap',
    deleteById,
  );

  const filteredGereedschappen = useMemo(
    () =>
      // gereedschappen.filter((g) => {
      //   return (
      //     g.naam.toLowerCase().includes(search.toLowerCase()) ||
      //     g.beschrijving.toLowerCase().includes(search.toLowerCase())
      //   );
      // }),
    [search, gereedschappen],
  );

  const handleDeleteGereedschap = useCallback(
    async (id) => {
      await deleteGereedschap(id);
      alert('Het gereedschap is verwijderd.');
    },
    [deleteGereedschap],
  );

  return (
    <>
      <h1>Gereedschappen</h1>

      <div className='input-group mb-3 w-50'>
        <input
          type='search'
          id='search'
          data-cy='gereedschap_search_input'
          className='form-control rounded'
          placeholder='Zoeken op naam of beschrijving'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type='button'
          data-cy='gereedschap_search_btn'
          className='btn bg-color'
          onClick={() => setSearch(text)}
        >
          Zoeken
        </button>
        <div className='clearfix'>
          <Link to='/gereedschap/add' className='btn bg-color float-end'>
            Voeg gereedschap toe
          </Link>
        </div>
      </div>

      <div className='mt-4'>
        <AsyncData loading={isLoading} error={error || deleteError}>
          <GereedschappenTabel gereedschappen={filteredGereedschappen} onDelete={handleDeleteGereedschap} />
        </AsyncData>
      </div>
    </>
  );
}
