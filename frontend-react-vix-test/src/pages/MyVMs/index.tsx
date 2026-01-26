import { ScreenFullPage } from "../../components/ScreenFullPage";
import { Stack } from "@mui/material";
import { Title } from "./components/Title";
import { Header } from "./components/Header";
import { TableComponent } from "./components/Table";
import CustomPagination from "../../components/Pagination/CustomPagination";
import { useZMyVMsList } from "../../stores/useZMyVMsList";
import { useMyVMList } from "../../hooks/useMyVMList";
import { useEffect } from "react";
import { useZUserProfile } from "../../stores/useZUserProfile";
import { useZGlobalVar } from "../../stores/useZGlobalVar";
import { useWindowSize } from "../../hooks/useWindowSize";
import { SkeletonTable } from "./components/SkeletonTable";
import { ModalEditVM } from "./components/ModalEditVM";
import { AbsoluteBackDrop } from "../../components/AbsoluteBackDrop";
import { ICreateVMPayload } from "../../types/VMTypes";

export const MyVMsPage = () => {
  const {
    setCurrentPage,
    setVMList,
    setTotalCount,
    setIsFirstLoading,
    setCurrentVM,
    totalCount,
    currentPage,
    search,
    order,
    orderBy,
    limit,
    status,
    isFirstLoading,
    currentVM,
    vmList,
    onlyMyVMs,
    selectedMSP,
  } = useZMyVMsList();

  const { fetchMyVmsList, isLoading, toggleStatusVM, deleteVM, updateVM } =
    useMyVMList();

  const { idBrand, role } = useZUserProfile();
  const { isOpenSideBar } = useZGlobalVar();
  const { width } = useWindowSize();
  const { updateThisVm, setUpdateThisVm } = useZGlobalVar();
  const { socketRef } = useZGlobalVar();

  const handlerFetchVMList = async (page: number = 0) => {
    let targetBrand: number | null | undefined = idBrand;

    if (role === "admin") {
      if (onlyMyVMs) {
        targetBrand = idBrand;
      } else if (selectedMSP) {
        targetBrand = Number(selectedMSP.idBrandMaster || selectedMSP);
      } else {
        targetBrand = null;
      }
    }

    const { totalCount, vmList } = await fetchMyVmsList({
      search,
      page: page || currentPage - 1 || 0,
      orderBy: orderBy ? `${orderBy}:${order}` : undefined,
      limit,
      idBrandMaster: targetBrand,
      status,
    });

    setVMList(vmList);
    setTotalCount(totalCount);
    if (isFirstLoading) setIsFirstLoading(false);
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const success = await toggleStatusVM(id, currentStatus);
    if (success) handlerFetchVMList();
  };

  const handleDelete = async (id: number) => {
    const success = await deleteVM(id);
    if (success) handlerFetchVMList();
  };

  const handleUpdate = async (id: number, data: ICreateVMPayload) => {
    const success = await updateVM(id, data);
    if (success) {
      handlerFetchVMList();
      setCurrentVM(null);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    setCurrentPage(1);
    handlerFetchVMList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, order, orderBy, selectedMSP, status, onlyMyVMs]);

  useEffect(() => {
    if (isOpenSideBar) return;
    if (isLoading) return;
    handlerFetchVMList(currentPage - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    if (isOpenSideBar) return;
    if (isLoading) return;
    if (!updateThisVm) return;
    const vmToUpdate = vmList.find((vm) => vm.idVM === updateThisVm);
    setUpdateThisVm(null);
    if (vmToUpdate) {
      handlerFetchVMList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateThisVm, isOpenSideBar, isLoading]);

  useEffect(() => {
    if (!socketRef.connected) return;
    socketRef.on("updateTask", () => {
      handlerFetchVMList();
    });
    return () => {
      socketRef.off("updateTask");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketRef, currentPage, search, order, orderBy, selectedMSP, status, onlyMyVMs]);

  return (
    <ScreenFullPage
      title={<Title />}
      sxTitleSubTitle={{ paddingLeft: "40px", paddingRight: "40px" }}
    >
      <Stack
        sx={{
          maxWidth: "100%",
          width: "100%",
          gap: "32px",
          "@media (max-width: 659px)": { gap: "0" },
        }}
      >
        {width < 660 ? (
          <Stack sx={{ marginTop: "-24px", width: "100%", padding: "16px" }}>
            <Header />
          </Stack>
        ) : (
          <Stack sx={{ width: "100%", padding: "0 24px" }}>
            <Header />
          </Stack>
        )}

        {isFirstLoading ? (
          <SkeletonTable />
        ) : (
          <Stack
            sx={{
              width: "100%",
              "@media (max-width: 1430px)": {
                padding: "16px",
                paddingBottom: "50px",
              },
            }}
          >
            {isLoading && <AbsoluteBackDrop open={isLoading} />}

            <Stack sx={{ width: "100%" }}>
              <TableComponent
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            </Stack>

            <Stack sx={{ width: "100%" }}>
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalCount}
                onPageChange={(page) => setCurrentPage(page)}
                limit={limit}
              />
            </Stack>
          </Stack>
        )}

        {Boolean(currentVM) && (
          <ModalEditVM
            open={Boolean(currentVM)}
            onClose={() => setCurrentVM(null)}
            onSave={(data) => handleUpdate(currentVM!.idVM, data)}
            onDelete={() => handleDelete(currentVM!.idVM)} 
            vmData={currentVM!}
          />
        )}
      </Stack>
    </ScreenFullPage>
  );
};