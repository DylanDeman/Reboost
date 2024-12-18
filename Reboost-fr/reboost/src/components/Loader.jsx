// src/components/Loader.jsx
export default function Loader() {
  return (
    <div data-cy='loader' className='d-flex flex-column align-items-center'>
      <div className='spinner-border'>
        <span className='visually-hidden'>Laden...</span>
      </div>
    </div>
  );
}
