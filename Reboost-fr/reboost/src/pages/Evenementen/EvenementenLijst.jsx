import EvenementenTabel from '../../components/Evenementen/EvenementenTabel';
import { useState, useMemo } from 'react';
import { EVENEMENT_DATA } from '../../api/mock_data';
export default function EvenementenLijst() {

  const [text, setText] = useState('');
  const [search, setSearch] = useState('');

  const filteredEvenementen = useMemo(() => EVENEMENT_DATA.filter((t) => {
    console.log('filtering...');
    return t.naam.toLowerCase().includes(search.toLowerCase());
  }), [search],
  );

  return (
    <>
      <h1>Evenementen</h1>
      <div className='input-group mb-3 w-50'>
        <input
          type="search"
          id='search'
          className='form-control rounded'
          placeholder='Search'
          value={text}
          onChange={(e) => setText(e.target.naam)}
        />
        <button
          type='button'
          className='btn btn-outline-primary'
          onClick={() => setSearch(text)}
        >
          Search
        </button>
      </div>

      <div className='mt-4'>
        <EvenementenTabel evenementen={filteredEvenementen}></EvenementenTabel>
      </div>
    </>
  );
}
