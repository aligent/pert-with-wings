import { FormEvent, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface PertTableProps {
  isEditing?: boolean;
}

// type Row = {
//   bestCase: string;
//   likely: string;
//   worstCase: string;
//   pert: string;
// };

function PertTable({ isEditing = false }: PertTableProps) {
  const [rows, setRows] = useState([
    {
      bestCase: '',
      likely: '',
      worstCase: '',
      pert: '',
      id: uuidv4(),
    },
  ]);

  const addRow = () => {
    const _rows = [...rows];
    _rows.push({
      bestCase: '',
      likely: '',
      worstCase: '',
      pert: '',
      id: uuidv4(),
    });
    setRows(_rows);
  };

  return (
    <table>
      <thead>
        <tr>
          <td>Best Case</td>
          <td>Likely</td>
          <td>Worst Case</td>
          <td>PERT</td>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            {isEditing ? (
              <>
                <td>
                  <input
                    // onInput={(e) => updateRow(e, index, 'bestCase')}
                    name="bestCase"
                    type="text"
                    //   value={bestCase}
                  />
                </td>
                <td>
                  <input
                    // onInput={(e) => updateRow(e, index, 'bestCase')}
                    name="likely"
                    type="text"
                    //   value={bestCase}
                  />
                </td>
                <td>
                  <input
                    // onInput={(e) => updateRow(e, index, 'bestCase')}
                    name="worstCase"
                    type="text"
                    //   value={bestCase}
                  />
                </td>
                <td>
                  <input
                    // onInput={(e) => updateRow(e, index, 'bestCase')}
                    name="pert"
                    type="text"
                    //   value={bestCase}
                  />
                </td>
                <td>
                  <button onClick={addRow}>+</button>
                </td>
              </>
            ) : (
              <>
                <td>1h</td>
                <td>2h</td>
                <td>4h</td>
                <td>2.1h</td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PertTable;
