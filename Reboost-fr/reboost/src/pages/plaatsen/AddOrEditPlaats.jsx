// src/pages/Evenements/AddOrEditEvenement.jsx
import useSWR from 'swr';
import { save, getById } from '../../api';
import Plaatsenform from '../../components/plaatsen/plaatsenForm';
import AsyncData from '../../components/AsyncData';
import useSWRMutation from 'swr/mutation';
import { useParams } from 'react-router-dom';

export default function AddOrEditPlaats() {

  const { id } = useParams();

  const {
    data: plaats,
    error: PlaatsenError,
    isLoading: PlaatsenLoading,
  } = useSWR(id ? `plaatsen/${id}` : null, getById);

  const { trigger: savePlaats, error: saveError } = useSWRMutation(
    'plaatsen',
    save,
  );

  return (
    <>
      <h1 className='text-light'>Voeg een plaats toe of bewerk er een</h1>

      <AsyncData error={PlaatsenError || saveError}
        loading={PlaatsenLoading}>

        <Plaatsenform plaats={plaats}
          savePlaats={savePlaats} />
      </AsyncData>
    </>
  );
}
