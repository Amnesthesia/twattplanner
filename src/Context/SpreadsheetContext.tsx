import { noop } from 'lodash';
import React from 'react';
import { CellObject, read, WorkBook, WorkSheet, utils, SSF } from 'xlsx';

interface ICell {
  v: string;	// raw value (see Data Types section for more info)
  w: string; //	formatted text (if applicable)
  t: string; //	type: b Boolean, e Error, n Number, d Date, s Text, z Stub
  f: string; //	cell formula encoded as an A1-style string (if applicable)
  F: string; //	range of enclosing array if formula is array formula (if applicable)
  D: string; //	if true, array formula is dynamic (if applicable)
  r: string; //	rich text encoding (if applicable)
  h: string; //	HTML rendering of the rich text (if applicable)
  c: string; //	comments associated with the cell
  z: string; //	number format string associated with the cell (if requested)
  l: string; //	cell hyperlink object (.Target holds link, .Tooltip is tooltip)
  s: string; // the style/theme of the cell (if applicable)
}

interface IPrimaveraFile extends Omit<WorkBook, 'Sheets'> {
  Sheets: {
    TASK: WorkSheet;
    USERDATA: WorkSheet;
  };
}

interface ISpreadsheetContext {
  file: IPrimaveraFile | null;
  columns: string[];
  rows: string[][];
  setValue(column: string, row: number, value: string): void;
  parse(file: File): Promise<void>;
}

const INITIAL_CONTEXT: ISpreadsheetContext = { file: null, parse: async () => {}, rows: [], columns: [], setValue: noop };
export const SpreadsheetContext = React.createContext<ISpreadsheetContext>(INITIAL_CONTEXT);

export function useSpreadsheetContext() {
  return React.useContext(SpreadsheetContext);
}

export function SpreadsheetProvider(props: React.PropsWithChildren<object>) {
  const { children } = props;
  const [file, setFile] = React.useState<IPrimaveraFile | null>(null);
  const [columns, setColumns] = React.useState<string[]>([]);
  const [rows, setRows] = React.useState<string[][]>([]);

  const parse = React.useCallback(async (file: File) => {
    const workbook = await file.arrayBuffer();
    const workbookJson = read(workbook, { type: 'array', cellDates: true });
    const [columnDataTypes, newColumns, ...r] = utils.sheet_to_json(workbookJson.Sheets.TASK, { header: 1 }) as string[][];
    const newRows = r.map((row, rowIndex) =>
      row.map((cell, cellIndex) => {
        if (/date/.test(newColumns[cellIndex])) {
          console.debug({ cell });
          //return SSF.parse_date_code(cell) as string;
        }
        return cell;
      }
      )
    );

    console.debug({ newColumns, newRows });
    setColumns(newColumns);
    setRows(
      newRows
    );
  }, []);

  const value = React.useMemo(() => ({ ...INITIAL_CONTEXT, rows, columns, file, parse }), [rows, columns, parse]);


  return (
    <SpreadsheetContext.Provider {...{ value }}>
      {children}
    </SpreadsheetContext.Provider>
  );
}