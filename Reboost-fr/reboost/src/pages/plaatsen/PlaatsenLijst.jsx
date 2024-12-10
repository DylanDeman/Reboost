import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import PlaatsenCards from '../../components/plaatsen/PlaatsenCards';
import { getAll, save, deleteById } from '../../api';
import AsyncData from '../../components/AsyncData';
import { Link } from 'react-router-dom';
import { useCallback } from 'react';

export default function PlaatsenLijst() {
  const { data, error, isLoading } = useSWR('plaatsen', getAll);

  const { trigger: deletePlaats, error: deleteError } = useSWRMutation('plaatsen', deleteById);

  const { trigger: savePlaats, error: saveError } = useSWRMutation('plaatsen', save);

  const handleDeletePlaats = useCallback(async (id) => {
    await deletePlaats(id);
    alert('De plaats is verwijderd.');
  }, [deletePlaats]);

  return (
    <>
      <h1>Plaatsen</h1>

      <AsyncData loading={isLoading} error={error || deleteError || saveError}>
        <PlaatsenCards plaatsen={data} onRate={savePlaats} onDelete={handleDeletePlaats} />
      </AsyncData>

      <div className='clearfix'>
        <Link to='/plaatsen/add' className='btn float-start bg-color'>
          Voeg een plaats toe.
        </Link>
      </div>
    </>
  );
}
