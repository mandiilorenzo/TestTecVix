import { Fragment, useEffect } from "react";
import { useZTheme } from "../../../stores/useZTheme";
import { Box, IconButton, Stack, Divider } from "@mui/material";
import { ImgFromDB } from "../../../components/ImgFromDB";
import { TextRob14Font1Xs } from "../../../components/Text1Xs";
import { TextRob12Font2Xs } from "../../../components/Text2Xs";
import { useTranslation } from "react-i18next";
import { PencilCicleIcon } from "../../../icons/PencilCicleIcon";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useZUserProfile } from "../../../stores/useZUserProfile";
import { useZMspRegisterPage } from "../../../stores/useZMspRegisterPage";
import { useBrandMasterResources } from "../../../hooks/useBrandMasterResources";

export const MspTable = () => {
  const { theme, mode } = useZTheme();
  const { t } = useTranslation();
  const store = useZMspRegisterPage();
  const { listAllBrands } = useBrandMasterResources();
  const { role } = useZUserProfile();

  useEffect(() => {
    const fetchMsps = async () => {
      try {
        const response = await listAllBrands();
        if (response && response.result) {
          store.setMspList(response.result);
        }
      } catch (error) {
        console.error("Erro ao carregar MSPs:", error);
      }
    };

    fetchMsps();
  }, []);

  const handleEdit = (id: number) => {
    const msp = store.mspList.find((c) => c.idBrandMaster === id);
    if (!msp) return;

    store.setEnterOnEditing(true);
    store.setIsEditing([id]);
    store.setActiveStep(0);
    store.setShowAddressFields(true);

    store.setModalOpen("registeringMsp");

    store.setCompanyName(msp.brandName || "");
    store.setCnpj(msp.cnpj || "");
    store.setContactEmail(msp.emailContact || "");
    store.setPhone(msp.smsContact || "");
    store.setSector(msp.setorName || "");

    store.setLocality(msp.location || "");

    store.setCep(msp.cep || "");
    store.setCountryState(msp.state || "");
    store.setStreet(msp.street || "");
    store.setStreetNumber(msp.placeNumber || "");

    store.setCityCode(msp.cityCode ? String(msp.cityCode) : "");
    store.setDistrict(msp.district || "");
    store.setIsPoc(Boolean(msp.isPoc));

    store.setMSPDomain(msp.domain || "");
    store.setAdmName(""); 
    store.setAdmEmail(""); 

    store.setCity(msp.city || "");

    store.setBrandLogo({
      brandLogoUrl: msp.brandLogo || "",
      brandObjectName: "logo"
    });
  };

  return (
    <Stack sx={{ width: "100%", maxHeight: "540px", overflow: "auto", gap: "16px" }}>
      {store.mspList
        .filter(msp =>
          msp.brandName.toLowerCase().includes(store.mspTableFilter.toLowerCase()) &&
          (!store.isPocFilter || msp.isPoc === store.isPocFilter)
        )
        .map((msp, index) => (
          <Fragment key={`${msp.idBrandMaster}-${msp.brandName}`}>
            <Box sx={{
              display: "flex", flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between", alignItems: "center",
              padding: "8px 4px", gap: "16px"
            }}>
              <Box sx={{ flex: "2", display: "flex", gap: "16px", alignItems: "center", width: "100%" }}>
                <ImgFromDB
                  style={{ width: "36px", height: "36px", borderRadius: "100%" }}
                  alt="msp image"
                  src={msp.brandLogo || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhGHdcalX0wUWxZQCiSv8WzmSPpFGHr4jlsw&s"}
                />
                <Stack>
                  <TextRob14Font1Xs sx={{ color: theme[mode].black, fontWeight: 500 }}>{msp.brandName}</TextRob14Font1Xs>
                  <TextRob12Font2Xs sx={{ color: theme[mode].gray }}>{msp.emailContact || "Sem e-mail"}</TextRob12Font2Xs>
                </Stack>
              </Box>

              <Box sx={{ flex: "1", display: { xs: "none", md: "flex" }, flexDirection: "column" }}>
                <TextRob14Font1Xs sx={{ color: theme[mode].black, fontWeight: 500 }}>{t("mspRegister.domain")}</TextRob14Font1Xs>
                <TextRob12Font2Xs sx={{ color: theme[mode].gray }}>{msp.domain}</TextRob12Font2Xs>
              </Box>

              <Box sx={{ flex: "2", display: "flex", gap: "8px", flexWrap: "wrap", width: "100%" }}>
                <TextRob14Font1Xs sx={{
                  padding: "0 10px", borderRadius: "12px", border: `1px solid ${msp.isActive ? theme[mode].ok : theme[mode].danger}`,
                  color: msp.isActive ? theme[mode].ok : theme[mode].danger
                }}>
                  {t(`colaboratorRegister.${msp.isActive ? "active" : "inactive"}`)}
                </TextRob14Font1Xs>
                {msp.isPoc && (
                  <TextRob14Font1Xs sx={{ padding: "0 10px", borderRadius: "12px", border: `1px solid ${theme[mode].warning}`, color: theme[mode].warning }}>
                    POC ativa
                  </TextRob14Font1Xs>
                )}
              </Box>

              <Box sx={{ display: "flex", gap: "8px" }}>
                <IconButton onClick={() => handleEdit(msp.idBrandMaster)}>
                  <PencilCicleIcon fill={theme[mode].blueMedium} />
                </IconButton>
                {role === "admin" && (
                  <IconButton onClick={() => { store.setMspToBeDeleted(msp); store.setModalOpen("deletedMsp"); }}>
                    <DeleteForeverIcon sx={{ color: theme[mode].danger }} />
                  </IconButton>
                )}
              </Box>
            </Box>
            {index !== store.mspList.length - 1 && <Divider sx={{ background: theme[mode].grayLight }} />}
          </Fragment>
        ))}
    </Stack>
  );
};