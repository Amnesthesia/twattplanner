import * as React from 'react';
import clsx from 'clsx';
import { Theme, styled } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import {
  AutoSizer,
  Column,
  Table,
  TableCellRenderer,
  TableHeaderProps,
} from 'react-virtualized';
import { useSpreadsheetContext } from './Context/SpreadsheetContext';
import { isDate, isNumber } from 'lodash';

const classes = {
  flexContainer: 'ReactVirtualizedDemo-flexContainer',
  tableRow: 'ReactVirtualizedDemo-tableRow',
  tableRowHover: 'ReactVirtualizedDemo-tableRowHover',
  tableCell: 'ReactVirtualizedDemo-tableCell',
  noClick: 'ReactVirtualizedDemo-noClick',
};

const styles = ({ theme }: { theme: Theme }) =>
  ({
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    '& .ReactVirtualized__Table__headerRow': {
      ...(theme.direction === 'rtl' && {
        paddingLeft: '0 !important',
      }),
      ...(theme.direction !== 'rtl' && {
        paddingRight: undefined,
      }),
    },
    [`& .${classes.flexContainer}`]: {
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box',
    },
    [`& .${classes.tableRow}`]: {
      cursor: 'pointer',
    },
    [`& .${classes.tableRowHover}`]: {
      '&:hover': {
        backgroundColor: theme.palette.grey[200],
      },
    },
    [`& .${classes.tableCell}`]: {
      flex: 1,
    },
    [`& .${classes.noClick}`]: {
      cursor: 'initial',
    },
  } as const);

interface ColumnData {
  dataKey: string;
  label: string;
  numeric?: boolean;
  width: number;
}

interface Row {
  index: number;
}

interface MuiVirtualizedTableProps {
  columns: readonly ColumnData[];
  rows: string[][];
  headerHeight?: number;
  onRowClick?: () => void;
  rowCount: number;
  rowHeight?: number;
}

class MuiVirtualizedTable extends React.PureComponent<MuiVirtualizedTableProps> {
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 48,
  };

  getRowClassName = ({ index }: Row) => {
    const { onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  cellRenderer: TableCellRenderer = ({ cellData, rowData, columnData, columnIndex }) => {
    const { columns, rowHeight, onRowClick } = this.props;
    let value = rowData[columnIndex];
    if (value instanceof Date) {
      value = value.toISOString();
    }
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={
          (columnIndex != null && columns[columnIndex].numeric) || false
            ? 'right'
            : 'left'
        }
      >
        {value}
      </TableCell>
    );
  };

  headerRenderer = ({
    label,
    columnIndex,
  }: TableHeaderProps & { columnIndex: number }) => {
    const { headerHeight, columns } = this.props;

    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? 'right' : 'left'}
      >
        <span>{label}</span>
      </TableCell>
    );
  };

  render() {
    const { columns, rowHeight, headerHeight, ...tableProps } = this.props;
    return (
      <AutoSizer deaultHeight={600}>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            {...tableProps}
            rowGetter={({ index }) => this.props.rows[index]}
            rowHeight={rowHeight!}
            gridStyle={{
              direction: 'inherit',
            }}
            headerHeight={headerHeight!}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={(headerProps) =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  cellDataGetter={({ rowData }) => rowData.index}
                  dataKey="index"
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

const VirtualizedTable = styled(MuiVirtualizedTable)(styles);

// ---

interface Data {
  calories: number;
  carbs: number;
  dessert: string;
  fat: number;
  id: number;
  protein: number;
}
type Sample = [string, number, number, number, number];

const sample: readonly Sample[] = [
  ['Frozen yoghurt', 159, 6.0, 24, 4.0],
  ['Ice cream sandwich', 237, 9.0, 37, 4.3],
  ['Eclair', 262, 16.0, 24, 6.0],
  ['Cupcake', 305, 3.7, 67, 4.3],
  ['Gingerbread', 356, 16.0, 49, 3.9],
];

export default function ReactVirtualizedTable() {
  const { columns, rows } = useSpreadsheetContext();

  const getWidthByDataType = React.useCallback((columnIndex: number) => {
    const firstRow = rows?.[1];
    if (firstRow) {
      const cellValue = typeof firstRow?.[columnIndex];
      if (isNumber(cellValue) || (typeof cellValue === 'string' && /^\d+$/.test(cellValue))) {
        return 200;
      }
      if (typeof cellValue === 'string') {
        return 350;
      }

      if (isDate(cellValue)) {
        return 350;
      }
    }
    return 400;
  }, []);

  const isDataNumeric = React.useCallback((columnIndex: number) => {
    const firstRow = rows?.[1];
    if (firstRow) {
      const cellValue = typeof firstRow?.[columnIndex];
      if (isNumber(cellValue) || (typeof cellValue === 'string' && /^\d+$/.test(cellValue))) {
        return true;
      }
    }
    return false;
  }, []);
  return (
    <Paper style={{ height: 400, width: '100%' }}>
      <VirtualizedTable
        rowCount={rows.length}
        rows={rows}
        columns={columns.map((column, index) => (
          {
            width: getWidthByDataType(index),
            label: column,
            dataKey: column,
            numeric: isDataNumeric(index)
          }
        ))}
      />
    </Paper>
  );
}