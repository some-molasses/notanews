import "./table.scss";

export function Table<T>({
  data,
  rowGenerator,
  headers,
  id,
}: {
  data: T[];
  rowGenerator: (item: T) => React.ReactNode;
  headers: string[];
  id?: string;
}) {
  return (
    <table className="nan-table" id={id}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>
              <div className="cell">{header}</div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{data.map((item) => rowGenerator(item))}</tbody>
    </table>
  );
}
