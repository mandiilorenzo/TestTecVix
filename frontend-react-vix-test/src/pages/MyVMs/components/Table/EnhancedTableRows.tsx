import TableBody from "@mui/material/TableBody";
import { useZMyVMsList } from "../../../../stores/useZMyVMsList";
import { RowVM } from "./RowVM";

interface EnhancedTableRowsProps {
  onToggleStatus: (id: number, currentStatus: string) => void;
  onDelete: (id: number) => void;
}

export const EnhancedTableRows = ({ onToggleStatus, onDelete }: EnhancedTableRowsProps) => {
  const { vmList } = useZMyVMsList();

  return (
    <TableBody
      key={"table-body-myvms"}
      sx={{
        padding: "20px",
      }}
    >
      {vmList.map((row, index) => (
        <RowVM
          key={`row-${index}-${row.idVM}`}
          vm={row}
          index={index}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      ))}
    </TableBody>
  );
};
