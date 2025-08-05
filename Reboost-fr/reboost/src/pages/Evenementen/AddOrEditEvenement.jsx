import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { useParams, useNavigate } from 'react-router-dom';

import { getAll, getById, save } from '../../api';
import EvenementForm from '../../components/evenementen/evenementenForm';
import AsyncData from '../../components/AsyncData';

export default function AddOrEditEvenement() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: evenement, error: evenementError, isLoading: evenementLoading } = useSWR(
    id ? `evenementen/${id}` : null,
    getById
  );
  const { data: plaatsen = [], error: plaatsenError, isLoading: plaatsenLoading } = useSWR('plaatsen', getAll);
  const { data: gebruikers = [], error: gebruikersError, isLoading: gebruikersLoading } = useSWR('gebruikers', getAll);
  const {
    data: beschikbareGereedschappen = [],
    error: gereedschapError,
    isLoading: gereedschapLoading,
    mutate: mutateGereedschap,
  } = useSWR('gereedschap', getAll);


  const { trigger: saveEvenement } = useSWRMutation('evenementen', save);

async function onSave(data) {
  try {

    const savedEvenement = await saveEvenement(data);


    const eventId = savedEvenement?.id ?? evenement?.id ?? data.id;

    if (!eventId) {
      throw new Error('No event ID found after saving.');
    }

    const previouslyLinked = evenement?.gereedschappen?.map((g) => g.id) || [];
    const currentSelected = data.gereedschap_ids ?? [];
    const existingIds = beschikbareGereedschappen.map((g) => g.id);

    const toLink = currentSelected.filter(
      (id) => !previouslyLinked.includes(id) && existingIds.includes(id)
    );
    const toUnlink = previouslyLinked.filter(
      (id) => !currentSelected.includes(id) && existingIds.includes(id)
    );

    await Promise.all(
      toLink.map((gid) => putGereedschap(gid, { beschikbaar: false, evenementId: eventId }))
    );

    await Promise.all(
      toUnlink.map((gid) => putGereedschap(gid, { beschikbaar: true, evenementId: null }))
    );

    mutateGereedschap();
    navigate('/evenementen');
  } catch (err) {
    console.error('Error saving evenement and updating gereedschap', err);
  }
}



  async function putGereedschap(gereedschapId, data) {
    if (!gereedschapId) return;
    try {
      const axios = (await import('axios')).default;
      const baseUrl = import.meta.env.VITE_API_URL;

      await axios.put(`${baseUrl}/gereedschap/${gereedschapId}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
      });
    } catch (error) {
      console.error(`Failed to update gereedschap ${gereedschapId}`, error);
      throw error;
    }
  }

  if (gebruikersError || evenementError || plaatsenError || gereedschapError) return <div>Error loading data.</div>;
  if (gebruikersLoading || evenementLoading || plaatsenLoading || gereedschapLoading) return <div>Loading...</div>;

  const linkedGereedschap = evenement?.gereedschappen || [];
  const availableNotLinked = beschikbareGereedschappen.filter(
    (g) => g.beschikbaar || linkedGereedschap.some((linked) => linked.id === g.id)
  );
  const gereedschapOptions = availableNotLinked;

  return (
    <>
      <h1>{id ? 'Bewerk evenement' : 'Voeg een evenement toe'}</h1>
      <AsyncData
        error={gebruikersError || evenementError || plaatsenError || gereedschapError}
        loading={gebruikersLoading || evenementLoading || plaatsenLoading || gereedschapLoading}
      >
        <EvenementForm
          gebruikers={gebruikers}
          plaatsen={plaatsen}
          gereedschappen={gereedschapOptions}
          evenement={evenement}
          saveEvenement={onSave}
          isEdit={!!id}
        />
      </AsyncData>
    </>
  );
}
