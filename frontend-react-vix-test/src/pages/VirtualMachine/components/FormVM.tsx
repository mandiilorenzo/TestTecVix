import { useState, useEffect, useCallback } from "react";
import { Divider, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useZTheme } from "../../../stores/useZTheme";
import { LabelInputVM } from "./LabelInputVM";
import { DropDowText } from "./DropDowText";
import { TOptionsTyped } from "../../../types/FormType";
import { SliderLabelNum } from "./SliderLabelNum";
import { CheckboxLabel } from "./CheckboxLabel";
import { Btn } from "../../../components/Buttons/Btn";
import { TextRob18Font2M } from "../../../components/Text2M";
import { TextRob16Font1S } from "../../../components/Text1S";
import { useVmResource } from "../../../hooks/useVmResource";
import { ModalConfirmCreate } from "./ModalConfirmCreate";
import { genStrongPass } from "../../../utils/genStrongPass";
import { MIN_PASS_SIZE } from "../../../configs/contants";
import { PasswordValidations } from "./PasswordValidations";
import { useZVMSugestion } from "../../../stores/useZVMSugestion";
import { ENetworkType, ICreateVMPayload, IVMResource } from "../../../types/VMTypes";
import { AbsoluteBackDrop } from "../../../components/AbsoluteBackDrop";
import { useZVM } from "../../../stores/useZVM";
import { useZUserProfile } from "../../../stores/useZUserProfile";

const osOptions = [
  { label: "Ubuntu 22.04 LTS", value: "ubuntu-22-04" },
  { label: "Ubuntu 20.04 LTS", value: "ubuntu-20-04" },
  { label: "Debian 11", value: "debian-11" },
  { label: "CentOS Stream 9", value: "centos-stream-9" },
  { label: "Windows Server 2022", value: "windows-2022" },
];

export const FormVM = () => {
  const { t } = useTranslation();
  const { mode, theme } = useZTheme();
  const { idBrand } = useZUserProfile();

  const {
    vmSO, setVmSO,
    vmPassword, setVmPassword,
    vmName, setVmName,
    vmvCpu, setVmvCpu,
    vmMemory, setVmMemory,
    vmDisk, setVmDisk,
    vmLocalization, setVmLocalization,
    hasBackup, setHasBackup,
    vmNetwork, setVmNetwork,
    openConfirm, setOpenConfirm,
  } = useZVM();

  const {
    createVm,
    validPassword,
    storageOptions,
    localizationOptions,
    networkTypeOptions,
    isLoadingCreateVM,
  } = useVmResource();

  const {
    os: sugestionOS,
    vCPU: sugestionVCPU,
    ram: sugestionRAM,
    disk: sugestionDisk,
    resetAll,
  } = useZVMSugestion();

  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const vmStorageType = {
    value: "ssd",
    label: "SSD",
  };

  const handleFieldTouch = useCallback((fieldName: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
  }, []);

  const handleCancel = () => {
    setVmPassword(genStrongPass(MIN_PASS_SIZE));
    setVmName("");
    setVmSO(null);
    setVmvCpu(1);
    setVmMemory(1);
    setVmDisk(20);
    setVmLocalization(null);
    setHasBackup(false);
    if (networkTypeOptions.length > 0) setVmNetwork(networkTypeOptions[0]);
    setTouchedFields({});
  };

  const handleCreateVm = async () => {
    const isValidPass = validPassword(vmPassword);
    if (!isValidPass) return;

    const payload: ICreateVMPayload = {
      vmName: vmName.trim(),
      vCPU: Number(vmvCpu),
      ram: Number(vmMemory),
      disk: Number(vmDisk),
      os: String(vmSO?.value || "ubuntu-22-04"),
      hasBackup: hasBackup,
      pass: vmPassword,
      networkType: vmNetwork?.value as unknown as number,
      idBrandMaster: idBrand ?? 1,
    };

    await createVm(payload as unknown as IVMResource);
  };

  const isNameValid = vmName && vmName.trim().length >= 2;
  const isPasswordValid = vmPassword && vmPassword.length >= MIN_PASS_SIZE && validPassword(vmPassword);
  
  const disabledBtn =
    !isNameValid ||
    !vmSO ||
    !vmvCpu || vmvCpu < 1 ||
    !vmMemory || vmMemory < 1 ||
    !vmDisk || vmDisk < 20 ||
    !vmLocalization ||
    !isPasswordValid ||
    !vmNetwork;

  useEffect(() => {
    if (sugestionOS) {
      const foundOS = osOptions.find(o => o.value === sugestionOS) || { label: sugestionOS, value: sugestionOS };
      setVmSO(foundOS);
    }
    if (sugestionVCPU && sugestionVCPU >= 1) setVmvCpu(sugestionVCPU);
    if (sugestionRAM && sugestionRAM >= 1) setVmMemory(sugestionRAM);
    if (sugestionDisk && sugestionDisk >= 20) setVmDisk(sugestionDisk);
  }, [sugestionOS, sugestionVCPU, sugestionRAM, sugestionDisk, setVmSO, setVmvCpu, setVmMemory, setVmDisk]);

  useEffect(() => {
    if (!vmNetwork && networkTypeOptions.length > 0) {
      setVmNetwork(networkTypeOptions[0]);
    }
  }, [networkTypeOptions, vmNetwork, setVmNetwork]);

  useEffect(() => {
    if (!vmLocalization && localizationOptions.length > 0) {
      setVmLocalization(localizationOptions[0]);
    }
  }, [localizationOptions, vmLocalization, setVmLocalization]);

  useEffect(() => {
    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoadingCreateVM && <AbsoluteBackDrop open={isLoadingCreateVM} />}
      <Stack className="w-full" sx={{ padding: "24px", gap: "24px" }}>

        <TextRob18Font2M sx={{ color: theme[mode].black, fontSize: "18px", fontWeight: "500", lineHeight: "24px" }}>
          {t("createVm.vmRegister")}
        </TextRob18Font2M>

        <Stack sx={{ gap: "24px", "@media (min-width: 660px)": { flexDirection: "row" } }}>
          <LabelInputVM disabled onChange={() => { }} value={"root"} label={t("createVm.userVM")} placeholder={t("createVm.name")} />
          <Stack sx={{ width: "100%" }}>
            <LabelInputVM
              onChange={(val) => {
                setVmPassword(val);
                if (!touchedFields.vmPassword) handleFieldTouch('vmPassword');
              }}
              value={vmPassword}
              label={t("createVm.password")}
              placeholder={t("createVm.userPassword")}
              type="password"
            />
            {touchedFields.vmPassword && <PasswordValidations vmPassword={vmPassword} />}
          </Stack>
        </Stack>

        <Divider sx={{ borderColor: theme[mode].grayLight }} />

        <LabelInputVM
          onChange={(val) => {
            setVmName(val);
            if (!touchedFields.vmName) handleFieldTouch('vmName');
          }}
          value={vmName}
          label={t("createVm.vmName")}
          placeholder={t("createVm.sampleName")}
          containerSx={{ "@media (min-width: 660px)": { maxWidth: "288px" } }}
        />

        <Stack sx={{ gap: "24px", "@media (min-width: 660px)": { flexDirection: "row" } }}>
          <DropDowText
            label={t("createVm.dataCenterLocation")}
            data={localizationOptions}
            value={vmLocalization}
            onChange={setVmLocalization}
          />
          <DropDowText
            label={t("createVm.operationalSystem") || "Sistema Operacional"}
            data={osOptions}
            value={vmSO}
            onChange={setVmSO}
            sxContainer={{ minWidth: "200px" }}
          />
        </Stack>

        <Stack sx={{ gap: "24px", "@media (min-width: 660px)": { flexDirection: "row" } }}>
          <SliderLabelNum label={t("createVm.cpu")} value={vmvCpu} onChange={setVmvCpu} min={1} max={16} />
          <SliderLabelNum label={t("createVm.memory")} value={vmMemory} onChange={setVmMemory} min={1} max={128} />
          <SliderLabelNum label={t("createVm.disk")} value={vmDisk} onChange={setVmDisk} min={20} max={2048} step={16} />
        </Stack>

        <Stack sx={{ gap: "24px" }}>
          <DropDowText
            label={t("createVm.network")}
            data={networkTypeOptions}
            value={vmNetwork}
            onChange={(val) => setVmNetwork(val as TOptionsTyped<ENetworkType>)}
            sxContainer={{ maxWidth: "280px" }}
          />

          <Stack sx={{ gap: "24px", flexDirection: "row", width: "100%" }}>
            {/* VOLTOU AO ORIGINAL: Desabilitado e Fixo */}
            <DropDowText
              disabled
              label={t("createVm.storageType")}
              data={storageOptions}
              value={vmStorageType}
              onChange={() => { }}
              sxContainer={{ maxWidth: "180px" }}
            />
          </Stack>

          <CheckboxLabel value={hasBackup} onChange={setHasBackup} label={t("createVm.autoBackup")} />
        </Stack>

        <Stack sx={{ "@media (min-width: 660px)": { flexDirection: "row", gap: "24px" } }}>
          <Btn onClick={handleCancel} sx={{ display: "none", padding: "9px 24px", backgroundColor: theme[mode].grayLight, borderRadius: "12px", "@media (min-width: 660px)": { minWidth: "120px", display: "inline" } }}>
            <TextRob16Font1S sx={{ color: theme[mode].gray, fontSize: "16px", fontWeight: "500", lineHeight: "16px" }}>
              {t("createVm.cancelBtn")}
            </TextRob16Font1S>
          </Btn>

          <Btn
            disabled={disabledBtn || isLoadingCreateVM}
            onClick={() => setOpenConfirm(true)}
            sx={{ padding: "9px 24px", backgroundColor: theme[mode].blue, borderRadius: "12px", "@media (min-width: 660px)": { minWidth: "160px" } }}
          >
            <TextRob16Font1S sx={{ color: theme[mode].btnText, fontSize: "16px", fontWeight: "500", lineHeight: "20px" }}>
              {isLoadingCreateVM ? "Criando..." : t("createVm.createBtn")}
            </TextRob16Font1S>
          </Btn>
        </Stack>
      </Stack>

      {openConfirm && (
        <ModalConfirmCreate
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
          onConfirm={() => {
            setOpenConfirm(false);
            handleCreateVm();
          }}
          hasBackup={hasBackup}
          vmUser={"root"}
          vmPassword={vmPassword}
          vmName={vmName}
          vmSO={vmSO?.label}
          vmvCpu={vmvCpu.toString()}
          vmMemory={vmMemory.toString()}
          vmDisk={vmDisk.toString()}
          vmStorageType={vmStorageType.label}
          vmLocalization={vmLocalization?.label}
          vmNetwork={vmNetwork?.label}
        />
      )}
    </>
  );
};