import { Stack } from "@mui/material";
import { VmList } from "./VmList"; 
import { useZTheme } from "../../../../stores/useZTheme";
import { HeaderVMList } from "./HeaderVMList"; 
import { IVMCreatedResponse } from "../../../../types/VMTypes";

interface VmsCardsListProps {
  vmList: IVMCreatedResponse[];
  isLoading: boolean;
}

export const VmsCardsList = ({ vmList, isLoading }: VmsCardsListProps) => {
  const { theme, mode } = useZTheme();

  return (
    <Stack
      sx={{
        backgroundColor: theme[mode].light, 
        padding: "0px 8px",
        width: "100%",
      }}
    >
      <HeaderVMList />

      <Stack
        sx={{
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <VmList vmList={vmList} isLoading={isLoading} />
      </Stack>
    </Stack>
  );
};
