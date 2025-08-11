import useSWR from 'swr';
import { save, getById } from '../../api';
import Plaatsenform from '../../components/plaatsen/Plaatsenform.jsx';
import AsyncData from '../../components/AsyncData';
import useSWRMutation from 'swr/mutation';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/Theme.context';

export default function AddOrEditPlaats() {
  const { id } = useParams();
  const { theme } = useContext(ThemeContext);

  const {
    data: plaats,
    error: PlaatsenError,
    isLoading: PlaatsenLoading,
  } = useSWR(id ? `plaatsen/${id}` : null, getById);

  const isEdit = !!id;

  const { trigger: savePlaats, error: saveError } = useSWRMutation(
    'plaatsen',
    save,
  );

  return (
    <>
      <h1 className={theme === 'dark' ? 'text-light' : 'text-dark'}>
        {isEdit ? 'Bewerk plaats' : 'Voeg een plaats toe'}
      </h1>

      <AsyncData error={PlaatsenError || saveError} loading={PlaatsenLoading}>
        <Plaatsenform plaats={plaats} savePlaats={savePlaats} isEdit={isEdit} />
      </AsyncData>
    </>
  );
}
