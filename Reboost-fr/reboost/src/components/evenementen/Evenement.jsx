const dateFormat = new Intl.DateTimeFormat('nl-BE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export default function Evenement({ id, naam, datum, plaats, auteur }) {
  return (
    <tr>
      <td>{id}</td>
      <td>{naam}</td>
      <td>{dateFormat.format(new Date(datum))}</td>
      <td>{plaats.adres}</td>
      <td>{auteur.naam}</td>
    </tr>
  );
}