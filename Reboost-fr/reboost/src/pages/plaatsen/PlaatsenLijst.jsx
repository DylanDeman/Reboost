import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import PlaatsenCards from '../../components/plaatsen/PlaatsenCards';
import { getAll, save, deleteById } from '../../api';
import AsyncData from '../../components/AsyncData';
import { Link } from 'react-router-dom';

export default function PlaatsenLijst() {
  const { data, error, isLoading } = useSWR('plaatsen', getAll);

  const { trigger: deletePlaats, error: deleteError } = useSWRMutation('plaatsen', deleteById);

  const { trigger: savePlaats, error: saveError } = useSWRMutation('plaatsen', save);

  return (
    <>
      <h1 className='text-light'>Plaatsen</h1>

      <AsyncData loading={isLoading} error={error || deleteError || saveError}>
        <PlaatsenCards plaatsen={data} onRate={savePlaats} onDelete={deletePlaats} />
      </AsyncData>

      <div className='clearfix'>
        <Link to='/plaatsen/add' className='btn btn-primary float-end'>
          Voeg een plaats toe.
        </Link>
      </div>
    </>
  );
}
