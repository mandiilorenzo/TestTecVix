import { Modal, SxProps } from "@mui/material";
import { useZTheme } from "../../../stores/useZTheme";
import { Stack } from "@mui/system";
import { FormEditVM } from "./FormEditVM";
import { IVMCreatedResponse, ICreateVMPayload } from "../../../types/VMTypes";

interface IProps {
  open: boolean;
  onClose: (edit?: boolean) => void;
  sx?: SxProps;
  onSave: (data: ICreateVMPayload) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  vmData: IVMCreatedResponse;
}

export const ModalEditVM = ({ open, onClose, sx, onSave, vmData, onDelete }: IProps) => {
  const { theme, mode } = useZTheme();
  return (
    <Modal
      open={open}
      onClose={() => onClose(false)}
      aria-hidden={!open}
      sx={{
        display: "flex",
        justifyContent: "center",
        overflowY: "auto",
        paddingTop: "32px",
        paddingBottom: "32px",
      }}
    >
      <Stack
        sx={{
          width: "90%",
          maxWidth: "1000px",
          height: "fit-content",
          backgroundColor: theme[mode].mainBackground,
          borderRadius: "12px",
          padding: "24px",
          ...sx,
        }}
      >
        <FormEditVM
          onClose={onClose}
          onSave={onSave}
          initialData={vmData}
          onDelete={onDelete}
        />
      </Stack>
    </Modal>
  );
};