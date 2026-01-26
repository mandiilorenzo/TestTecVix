import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { SortByParams, useZMyVMsList } from "../../../../stores/useZMyVMsList";
import { EnhancedTableHead } from "./EnhancedTableHead";
import { EnhancedTableRows } from "./EnhancedTableRows";

interface TableComponentProps {
  onToggleStatus: (id: number, currentStatus: string) => void;
  onDelete: (id: number) => void;
}

export const TableComponent = ({ onToggleStatus, onDelete }: TableComponentProps) => {
  const { totalCount, order, orderBy, setOrder, setOrderBy } = useZMyVMsList();

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: SortByParams,
  ) => {
    const newSortBy =
      property !== orderBy ? "asc" : order === "asc" ? "desc" : "asc";
    setOrder(newSortBy);
    setOrderBy(property);
  };

  return (
    <Box sx={{ width: "100%", overflow: "auto" }}>
      <Paper sx={{ width: "100%", backgroundColor: "transparent" }}>
        <TableContainer>
          <Table aria-labelledby="tableTitle" size={"medium"}>
            <EnhancedTableHead
              numSelected={totalCount}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={() => { }}
              onRequestSort={handleRequestSort}
              rowCount={totalCount}
            />
            <EnhancedTableRows
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
            />
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};