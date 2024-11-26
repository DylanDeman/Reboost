// src/pages/Evenements/AddOrEditEvenement.jsx
import useSWR from 'swr';
import { getAll, save, getById } from '../../api';
import EvenementenForm from '../../components/evenementen/evenementenForm';
import AsyncData from '../../components/AsyncData';
import useSWRMutation from 'swr/mutation';
import { useParams } from 'react-router-dom';

export default function AddOrEditEvenement() {

  const { id } = useParams();

  const {
    data: evenement,
    error: EvenementError,
    isLoading: EvenementLoading,
  } = useSWR(id ? `evenementen/${id}` : null, getById);

  const { trigger: saveEvenement, error: saveError } = useSWRMutation(
    'evenementen',
    save,
  );

  const {
    data: plaatsen = [],
    error: plaatsenError,
    isLoading: plaatsenLoading,
  } = useSWR('plaatsen', getAll);

  const {
    data: gebruikers = [],
    error: gebruikersError,
    isLoading: gebruikersLoading,
  } = useSWR('gebruikers', getAll);

  return (
    <>
      <h1 className='text-light'>Voeg een evenement toe of bewerk er een</h1>

      <AsyncData error={gebruikersError || EvenementError || plaatsenError || saveError}
        loading={gebruikersLoading || EvenementLoading || plaatsenLoading}>

        <EvenementenForm gebruikers={gebruikers} plaatsen={plaatsen} evenement={evenement}
          saveEvenement={saveEvenement} />
      </AsyncData>
    </>
  );
}
