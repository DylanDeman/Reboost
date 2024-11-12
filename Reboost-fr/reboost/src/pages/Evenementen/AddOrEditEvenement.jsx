// src/pages/Evenements/AddOrEditEvenement.jsx
import useSWR from 'swr'; // 👈 1
import { getAll, save, getById } from '../../api'; // 👈 1
import EvenementenForm from '../../components/evenementen/evenementenForm'; // 👈 2
import AsyncData from '../../components/AsyncData'; // 👈 3
import useSWRMutation from 'swr/mutation'; // 👈 1
import { useParams } from 'react-router-dom'; // 👈 1

export default function AddOrEditEvenement() {

  const { id } = useParams();

  const {
    data: Evenement,
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
  } = useSWR('plaatsen', getAll); // 👈 1

  return (
    <>
      <h1 className='text-light'>Voeg een evenement toe of bewerk er een</h1>

      {/* 👇 3 */}
      <AsyncData error={EvenementError || plaatsenError || saveError} loading={EvenementLoading || plaatsenLoading}>
        {/* 👇 2 */}
        <EvenementenForm plaatsen={plaatsen} Evenement={Evenement} saveEvenement={saveEvenement} />
      </AsyncData>
    </>
  );
}
