import useSWR from 'swr';
import { getAll, save, getById } from '../../api';
import GereedschapForm from '../../components/gereedschappen/GereedschapForm.jsx';
import AsyncData from '../../components/AsyncData';
import useSWRMutation from 'swr/mutation';
import { useParams } from 'react-router-dom';

export default function AddOrEditGereedschap() {
  const { id } = useParams();

  const {
    data: gereedschap,
    error: gereedschapError,
    isLoading: gereedschapLoading,
  } = useSWR(id ? `gereedschap/${id}` : null, getById);

  const { trigger: saveGereedschap, error: saveError } = useSWRMutation(
    'gereedschap',
    save,
  );

  const {
    data: evenementen = [],
    error: evenementenError,
    isLoading: evenementenLoading,
  } = useSWR('evenementen', getAll);

  const isEdit = Boolean(id);
  const title = isEdit ? 'Gereedschap bewerken' : 'Nieuw gereedschap toevoegen';

  return (
    <>
      <h1>{title}</h1>

      <AsyncData 
        error={gereedschapError || evenementenError || saveError}
        loading={gereedschapLoading || evenementenLoading}
      >
        <GereedschapForm 
          gereedschap={gereedschap}
          evenementen={evenementen}
          saveGereedschap={saveGereedschap}
          isEdit={isEdit}
        />
      </AsyncData>
    </>
  );
}