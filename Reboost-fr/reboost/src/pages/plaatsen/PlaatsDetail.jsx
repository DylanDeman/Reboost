// src/pages/Plaatss/PlaatsDetail.jsx
import { useParams } from 'react-router-dom';
import { getById } from '../../api/index';
import useSWR from 'swr';
import AsyncData from '../../components/AsyncData';

const PlaatsDetail = () => {
  const { id } = useParams();
  const idAsNumber = Number(id);

  const {
    data: Plaats,
    error: PlaatsError,
    isLoading: PlaatsLoading,
  } = useSWR(id ? `plaatsen/${idAsNumber}` : null, getById);

  if (!Plaats) {
    return (
      <div>
        <h1>Plaats niet gevonden</h1>
        <p>Er is geen plaats met id {id}.</p>
      </div>
    );
  }

  return (
    <>
      <AsyncData loading={PlaatsLoading} error={PlaatsError}>
        <h1 className='text-light'>{Plaats.naam}</h1>
        <p className='text-light'>{Plaats.straat} {Plaats.huisnummer}, {Plaats.postcode} {Plaats.gemeente}</p>
      </AsyncData>
    </>
  );
};

export default PlaatsDetail;
