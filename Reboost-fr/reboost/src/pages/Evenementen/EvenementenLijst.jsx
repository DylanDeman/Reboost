import EvenementenTabel from '../../components/Evenementen/EvenementenTabel';
import { useState, useMemo } from 'react';
import { EVENEMENT_DATA } from '../../api/mock_data';
export default function EvenementenLijst() {

  const [text, setText] = useState('');
  const [search, setSearch] = useState('');

  const filteredEvenementen = useMemo(() => EVENEMENT_DATA.filter((evenement) => {
    console.log('filtering...');
    return evenement.naam.toLowerCase().includes(search.toLowerCase());
  }), [search],
  );

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
      </div>

      <div className='mt-4'>
        <EvenementenTabel evenementen={filteredEvenementen} />
      </div>
    </>
  );
}
