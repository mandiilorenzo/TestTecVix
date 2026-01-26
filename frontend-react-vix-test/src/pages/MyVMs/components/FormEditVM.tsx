import { Divider, IconButton, Stack } from "@mui/material";
import { TextRob18Font2M } from "../../../components/Text2M";
import { useZTheme } from "../../../stores/useZTheme";
import { useTranslation } from "react-i18next";
import { LabelInputVM } from "../../VirtualMachine/components/LabelInputVM";
import { useState } from "react";
import { useVmResource } from "../../../hooks/useVmResource";
import { TOptions } from "../../../types/FormType";
import { DropDowText } from "../../VirtualMachine/components/DropDowText";
import { SliderLabelNum } from "../../VirtualMachine/components/SliderLabelNum";
import { CheckboxLabel } from "../../VirtualMachine/components/CheckboxLabel";
import { Btn } from "../../../components/Buttons/Btn";
import { TextRob16Font1S } from "../../../components/Text1S";
import { ModalConfirmCreate } from "../../VirtualMachine/components/ModalConfirmCreate";
import { CloseXIcon } from "../../../icons/CloseXIcon";
import { PlayCircleIcon } from "../../../icons/PlayCircleIcon";
import { StopCircleIcon } from "../../../icons/StopCircleIcon";
import { TextRob16FontL } from "../../../components/TextL";
import { useStatusInfo } from "../../../hooks/useStatusInfo";
import { PasswordValidations } from "../../VirtualMachine/components/PasswordValidations";
import { ModalDeleteVM } from "./ModalDeleteVM";
import { AbsoluteBackDrop } from "../../../components/AbsoluteBackDrop";
import { ModalStartVM } from "./ModalStartVM";
import { ModalStopVM } from "./ModalStopVM";
import { IVMCreatedResponse, ICreateVMPayload } from "../../../types/VMTypes";

interface IProps {
  onClose: (edit?: boolean) => void;
  onSave: (data: ICreateVMPayload) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  initialData: IVMCreatedResponse;
}

export const FormEditVM = ({ onClose, onSave, initialData, onDelete }: IProps) => {
  const { theme, mode } = useZTheme();
  const { t } = useTranslation();

  const {
    storageOptions,
    localizationOptions,
    validPassword,
    getNetworkType,
  } = useVmResource();

  const { statusHashMap } = useStatusInfo();

  const [vmPassword, setVmPassword] = useState(initialData.pass || "");
  const [vmName, setVmName] = useState(initialData.vmName || "");
  const [vmSO] = useState<TOptions>({
    label: initialData.os,
    value: initialData.os,
  });
  const [vmvCpu, setVmvCpu] = useState(initialData.vCPU);
  const [vmMemory, setVmMemory] = useState(initialData.ram);
  const [vmDisk, setVmDisk] = useState(initialData.disk);
  const [vmStorageType] = useState<TOptions>({
    value: "ssd",
    label: "SSD",
  });
  const [vmLocalization] = useState<TOptions>({
    label: localizationOptions[0]?.label,
    value: localizationOptions[0]?.value,
  });
  const [hasBackup, setHasBackup] = useState(initialData.hasBackup);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [status, setStatus] = useState<string | null>(initialData.status);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [vmIDToStart, setVmIDToStart] = useState<number>(0);
  const [vmIDToStop, setVmIDToStop] = useState<number>(0);

  const [isSaving, setIsSaving] = useState(false);

  const handleCancel = () => {
    setVmPassword(initialData.pass);
    setVmName(initialData.vmName);
    onClose();
  };

  const handleEditVm = async () => {
    const isValidPass = validPassword(vmPassword);
    if (!isValidPass) {
      setOpenConfirm(false);
      return;
    }

    setIsSaving(true);
    setOpenConfirm(false);

    const payload = {
      vmName: vmName,
      vCPU: vmvCpu,
      ram: vmMemory,
      disk: vmDisk,
      hasBackup: hasBackup,
      os: String(vmSO?.value) || "",
      pass: vmPassword,
    };

    await onSave(payload);

    setIsSaving(false);
    onClose(true);
  };

  const handleStopVM = async () => {
    setStatus("STOPPED");
    // Se quiser salvar o status via PUT, descomente:
    // await onSave({ status: "STOPPED" });
    setVmIDToStop(0);
  };

  const handleStartVM = async () => {
    setStatus("RUNNING");
    setVmIDToStart(0);
  };

  const disabledBtn =
    !vmName ||
    !vmSO ||
    !vmvCpu ||
    !vmMemory ||
    !vmDisk ||
    !vmPassword ||
    !vmLocalization;

  return (
    <>
      {isSaving && <AbsoluteBackDrop open={true} />}

      <Stack sx={{ width: "100%", gap: "24px" }}>
        <Stack sx={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <TextRob18Font2M sx={{ color: theme[mode].black, fontSize: "18px", fontWeight: "500", lineHeight: "24px" }}>
            {t("createVm.vmEdit")}
          </TextRob18Font2M>
          <IconButton onClick={() => onClose()}>
            <CloseXIcon fill={theme[mode].gray} />
          </IconButton>
        </Stack>

        <Stack sx={{ gap: "24px", "@media (min-width: 660px)": { flexDirection: "row" } }}>
          <LabelInputVM disabled onChange={() => { }} value={"root"} label={t("createVm.userVM")} placeholder={t("createVm.name")} />
          <Stack sx={{ width: "100%" }}>
            <LabelInputVM
              onChange={(v) => setVmPassword(v)}
              value={vmPassword}
              label={t("createVm.password")}
              placeholder={t("createVm.userPassword")}
              type="password"
            />
            <PasswordValidations vmPassword={vmPassword} />
          </Stack>
        </Stack>

        <Divider sx={{ borderColor: theme[mode].grayLight }} />

        <LabelInputVM
          onChange={setVmName}
          value={vmName}
          label={t("createVm.vmName")}
          placeholder={t("createVm.sampleName")}
          containerSx={{ "@media (min-width: 660px)": { maxWidth: "288px" } }}
        />

        <Stack sx={{ gap: "24px", "@media (min-width: 660px)": { flexDirection: "row" } }}>
          <DropDowText disabled label={t("createVm.dataCenterLocation")} data={localizationOptions} value={vmLocalization} onChange={() => { }} />
          <DropDowText label={t("createVm.operationalSystem")} data={[]} value={vmSO} onChange={() => { }} disabled />
        </Stack>

        <Stack sx={{ gap: "24px", "@media (min-width: 660px)": { flexDirection: "row" } }}>
          <SliderLabelNum label={t("createVm.cpu")} value={vmvCpu} onChange={setVmvCpu} min={1} max={16} />
          <SliderLabelNum label={t("createVm.memory")} value={vmMemory} onChange={setVmMemory} min={1} max={128} />
          <SliderLabelNum label={t("createVm.disk")} value={vmDisk} onChange={setVmDisk} min={20} max={2048} step={16} />
        </Stack>

        <Stack sx={{ gap: "24px" }}>
          <Stack sx={{ gap: "24px", width: "50%", "@media (min-width: 660px)": { flexDirection: "row", width: "100%", gap: "40px" } }}>
            <DropDowText disabled label={t("createVm.storageType")} data={storageOptions} value={vmStorageType} onChange={() => { }} sxContainer={{ "@media (min-width: 660px)": { maxWidth: "180px" } }} />
            <DropDowText disabled label={t("createVm.network")} data={[]} value={getNetworkType({ networkTypeValue: initialData.networkType })} onChange={() => { }} sxContainer={{ maxWidth: "280px" }} />
          </Stack>

          <TextRob18Font2M sx={{ color: theme[mode].black, fontSize: "18px", fontWeight: "500", lineHeight: "24px" }}>
            {t("home.status", { status: statusHashMap[status || "STOPPED"] })}
          </TextRob18Font2M>

          <Stack flexDirection={"column"} gap={"16px"} sx={{ "@media (min-width: 660px)": { flexDirection: "row" } }}>
            <Stack sx={{ backgroundColor: theme[mode].grayLight, justifyContent: "flex-start", alignItems: "flex-start", border: "1px solid " + theme[mode].grayLight, borderRadius: "12px", padding: "8px", gap: "16px", width: "fit-content", height: "fit-content" }}>
              <IconButton
                disabled={status === "RUNNING"}
                onClick={() => setVmIDToStart(initialData.idVM)}
                sx={{ gap: "8px", ":hover": { opacity: 0.8 }, ":disabled": { opacity: 0.5 } }}
              >
                <PlayCircleIcon fill={theme[mode].greenLight} />
                <TextRob16FontL sx={{ fontWeight: 400, lineHeight: "16px", color: theme[mode].primary }}>{t("home.start")}</TextRob16FontL>
              </IconButton>
              <IconButton
                disabled={status === "STOPPED"}
                onClick={() => setVmIDToStop(initialData.idVM)}
                sx={{ gap: "8px", ":hover": { opacity: 0.8 }, ":disabled": { opacity: 0.5 } }}
              >
                <StopCircleIcon fill={theme[mode].lightRed} />
                <TextRob16FontL sx={{ fontWeight: 400, lineHeight: "16px", color: theme[mode].primary }}>{t("home.stop")}</TextRob16FontL>
              </IconButton>
            </Stack>
          </Stack>
          <CheckboxLabel value={hasBackup} onChange={setHasBackup} label={t("createVm.autoBackup")} />
        </Stack>

        <Stack sx={{ gap: "24px", "@media (min-width: 660px)": { flexDirection: "row" } }}>
          <Btn onClick={handleCancel} sx={{ display: "none", padding: "9px 24px", backgroundColor: theme[mode].grayLight, borderRadius: "12px", "@media (min-width: 660px)": { minWidth: "120px", display: "inline" } }}>
            <TextRob16Font1S sx={{ color: theme[mode].gray, fontSize: "16px", fontWeight: "500", lineHeight: "16px" }}>{t("createVm.cancelBtn")}</TextRob16Font1S>
          </Btn>

          <Btn disabled={disabledBtn} onClick={() => setOpenConfirm(true)} sx={{ padding: "9px 24px", backgroundColor: theme[mode].blue, borderRadius: "12px", "@media (min-width: 660px)": { minWidth: "160px" } }}>
            <TextRob16Font1S sx={{ color: theme[mode].btnText, fontSize: "16px", fontWeight: "500", lineHeight: "20px" }}>{t("createVm.edit")}</TextRob16Font1S>
          </Btn>

          <Btn disabled={disabledBtn} onClick={() => setOpenDeleteModal(true)} sx={{ padding: "9px 24px", backgroundColor: "transparent", border: "1px solid " + theme[mode].danger, borderRadius: "12px", maxWidth: "150px", marginLeft: "auto" }}>
            <TextRob16Font1S sx={{ color: theme[mode].danger, fontSize: "16px", fontWeight: "400", lineHeight: "20px" }}>{t("createVm.deleteVM")}</TextRob16Font1S>
          </Btn>
        </Stack>
      </Stack>

      {openConfirm && (
        <ModalConfirmCreate
          isEditing
          title={t("createVm.vmEdit")}
          textConfirmBtn={t("createVm.edit")}
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
          onConfirm={handleEditVm}
          hasBackup={hasBackup}
          vmUser={"root"}
          vmPassword={vmPassword}
          vmName={vmName}
          vmSO={vmSO?.label}
          vmvCpu={vmvCpu.toString()}
          vmMemory={vmMemory.toString()}
          vmDisk={vmDisk.toString()}
          vmStorageType={vmStorageType?.label}
          vmLocalization={vmLocalization?.label}
          vmNetwork={getNetworkType({ networkTypeValue: initialData.networkType })?.label}
          status={statusHashMap[status || "STOPPED"]}
        />
      )}

      {openDeleteModal && (
        <ModalDeleteVM
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          onConfirm={async () => {
            await onDelete(initialData.idVM);
            setOpenDeleteModal(false);
            onClose(true); 
          }}
          onCancel={() => setOpenDeleteModal(false)}
        />
      )}
      {Boolean(vmIDToStart) && (
        <ModalStartVM
          vmName={vmName}
          idVM={vmIDToStart}
          onConfirm={handleStartVM}
          onCancel={() => setVmIDToStart(0)}
        />
      )}
      {Boolean(vmIDToStop) && (
        <ModalStopVM
          vmName={vmName}
          idVM={vmIDToStop}
          onConfirm={handleStopVM}
          onCancel={() => setVmIDToStop(0)}
        />
      )}
    </>
  );
};