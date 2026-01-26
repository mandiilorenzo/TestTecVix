import { Box, Modal, Stack } from "@mui/material";
import { ScreenFullPage } from "../../components/ScreenFullPage";
import { TextRob20Font1MB } from "../../components/Text1MB";
import { useZTheme } from "../../stores/useZTheme";
import { useZMspRegisterPage } from "../../stores/useZMspRegisterPage";
import { useTranslation } from "react-i18next";
import { TextRob16Font1S } from "../../components/Text1S";
import { MspTableFilters } from "./MspTable/MspTableFilter";
import { MspTable } from "./MspTable/MspTable";
import { MspModal } from "./MspModal";
import { ModalDeleteMsp } from "./ModalDeleteMsp";
import { useEffect, useState, useCallback } from "react";
import { ModalUSerNotCreated } from "./ModalUSerNotCreated";
import { ModalDeleteVMsFromMSP } from "./ModalDeleteVMsFromMSP";
import { useBrandMasterResources } from "../../hooks/useBrandMasterResources";
import { AbsoluteBackDrop } from "../../components/AbsoluteBackDrop";
import { useVmResource } from "../../hooks/useVmResource";
import { MspRegisterForm } from "./components/MspRegisterForm"; 

export const MSPRegisterPage = () => {
  const { theme, mode } = useZTheme();
  const {
    modalOpen,
    mspToBeDeleted,
    setModalOpen,
    setMspToBeDeleted,
    setActiveStep,
    resetAll,
    setIsEditing,
    brandMasterDeleted,
    vmsToBeDeleted,
    setBrandMasterDeleted,
    setVmsToBeDeleted,
  } = useZMspRegisterPage();

  const { t } = useTranslation();
  const { isLoading } = useBrandMasterResources();
  const { isLoadingDeleteVM, deleteVM } = useVmResource();
  const [openModalUserNotCreated, setOpenModalUserNotCreated] = useState(false);

  const resetAllStepStates = useCallback(() => {
    setIsEditing([]);
    setActiveStep(0);
    resetAll();
  }, [setIsEditing, setActiveStep, resetAll]);

  const handleCancelAfterDeleteMSP = () => {
    setMspToBeDeleted(null);
    setModalOpen(null);
    setBrandMasterDeleted(null);
    setVmsToBeDeleted([]);
    resetAllStepStates();
  };

  const handleAfterDeleteMSP = async () => {
    await Promise.all(vmsToBeDeleted.map((vm) => deleteVM(vm.idVM)));
    handleCancelAfterDeleteMSP();
  };

  useEffect(() => {
    return () => {
      resetAllStepStates();
    };
  }, [resetAllStepStates]);

  return (
    <ScreenFullPage
      title={
        <Stack spacing={1.5} sx={{ marginTop: { xs: "24px", md: "40px" }, marginBottom: "32px" }}>
          <TextRob20Font1MB sx={{ color: theme[mode].primary, fontSize: "28px", fontWeight: "500" }}>
            {t("mspRegister.title", "Cadastro de MSPs")}
          </TextRob20Font1MB>
          <TextRob16Font1S sx={{ color: theme[mode].tertiary, fontSize: "14px" }}>
            Gerencie as empresas e administradores parceiros
          </TextRob16Font1S>
        </Stack>
      }
      sxTitleSubTitle={{ padding: { xs: "0 20px", md: "0 40px" } }}
      sxContainer={{ padding: { xs: "0 20px 80px", md: "0 40px 40px" } }}
    >
      {(isLoading || isLoadingDeleteVM) && <AbsoluteBackDrop open />}

      <Stack sx={{ width: "100%", gap: "26px", maxWidth: "100%", overflow: "hidden" }}>

        <MspRegisterForm />

        <Stack
          sx={{
            background: theme[mode].mainBackground,
            borderRadius: "16px",
            width: "100%",
            padding: { xs: "16px", md: "24px" },
            boxSizing: "border-box",
            gap: "24px"
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <TextRob16Font1S sx={{ color: theme[mode].black, fontWeight: 500, fontSize: "16px" }}>
              {t("mspRegister.tableTitle", "MSPs Cadastradas")}
            </TextRob16Font1S>

            <MspTableFilters />
          </Box>

          <MspTable />
        </Stack>
      </Stack>

      {modalOpen !== null && (
        <Modal
          open={modalOpen !== null && modalOpen !== "registeringMsp"} 
          onClose={() => setModalOpen(null)}
          sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Box sx={{ width: '90%', maxWidth: '600px', outline: 'none' }}>

            {(modalOpen === "editedMsp" || modalOpen === "createdMsp") && (
              <MspModal modalType={modalOpen} onClose={() => setModalOpen(null)} />
            )}

            {modalOpen === "deletedMsp" && mspToBeDeleted && (
              <ModalDeleteMsp
                mspToDelete={mspToBeDeleted}
                onClose={() => {
                  setModalOpen(null);
                  setMspToBeDeleted(null);
                }}
              />
            )}
          </Box>
        </Modal>
      )}

      {openModalUserNotCreated && (
        <ModalUSerNotCreated
          open={openModalUserNotCreated}
          onClose={() => {
            setOpenModalUserNotCreated(false);
            resetAllStepStates();
          }}
        />
      )}

      {Boolean(brandMasterDeleted) && (
        <ModalDeleteVMsFromMSP
          onClose={handleCancelAfterDeleteMSP}
          onConfirm={handleAfterDeleteMSP}
          open={Boolean(brandMasterDeleted)}
          msp={brandMasterDeleted}
          vms={vmsToBeDeleted}
        />
      )}
    </ScreenFullPage>
  );
};