import { Stack, Typography, Box, Divider, CircularProgress } from "@mui/material";
import { useZTheme } from "../../../stores/useZTheme";
import { useZMspRegisterPage } from "../../../stores/useZMspRegisterPage";
import { InputLabel } from "../../../components/Inputs/Input";
import { Btn } from "../../../components/Buttons/Btn";
import { TextRob16Font1S } from "../../../components/Text1S";
import { useState, useRef, useCallback } from "react";
import { UploadIcon } from "../../../icons/UploadIcon";
import { BrandMasterService, CreateBrandMasterInput } from "../../../services/BrandMasterService";
import { mspStepTwoSchema } from "../../../utils/mspSchema";
import { toast } from "react-toastify";

export const MspFormStepTwo = ({ onBack, onConfirm }: { onBack: () => void; onConfirm: () => void }) => {
    const { theme, mode } = useZTheme();
    const store = useZMspRegisterPage();
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const inputStyle = {
        backgroundColor: "#2C313C",
        "& .MuiInputBase-input": {
            color: "#FFFFFF !important",
            WebkitTextFillColor: "#FFFFFF !important",
        },
        "& .MuiInputBase-input::placeholder": {
            color: `${theme[mode].tertiary} !important`,
            WebkitTextFillColor: `${theme[mode].tertiary} !important`,
            opacity: 1,
        }
    };

    const handleFieldChange = (field: string, value: string, setter: (val: string) => void) => {
        setter(value);
        if (fieldErrors[field]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleClear = useCallback(() => {
        store.setMSPDomain("");
        store.setAdmName("");
        store.setAdmEmail("");
        store.setAdmPhone("");
        store.setPosition("");
        store.setCity("");
        store.setBrandLogo({ brandLogoUrl: "", brandObjectName: "" });

        store.setCompanyName("");
        store.setLocality("");
        store.setCnpj("");
        store.setPhone("");
        store.setSector("");
        store.setContactEmail("");
        store.setCep("");
        store.setCountryState("");
        store.setDistrict("");
        store.setCityCode("");
        store.setIsPoc(false);
        store.setStreet("");
        store.setStreetNumber("");

        setFieldErrors({});
        if (fileInputRef.current) fileInputRef.current.value = "";

    }, [store]);

    const handleConfirm = async () => {
        const result = mspStepTwoSchema.safeParse({
            mspDomain: store.mspDomain?.trim() || "",
            admName: store.admName?.trim() || "",
            admEmail: store.admEmail?.trim() || "",
            username: store.city?.trim() || "",
        });

        if (!result.success) {
            const errors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                errors[issue.path[0] as string] = issue.message;
            });
            setFieldErrors(errors);
            toast.error("Por favor, preencha os campos obrigatórios corretamente.");
            return;
        }

        try {
            setIsSubmitting(true);

            const payload: CreateBrandMasterInput = {
                brandName: store.companyName?.trim() || null,
                domain: store.mspDomain?.trim() || null,

                city: store.locality?.trim() || null,
                location: store.locality?.trim() || null,
                setorName: store.city?.trim() || null,

                brandLogo: null,
                cnpj: store.cnpj?.replace(/\D/g, '') || null,
                cep: store.cep?.replace(/\D/g, '') || null,
                emailContact: store.contactEmail?.trim() || null,
                district: store.district?.trim() || null,
                isPoc: Boolean(store.isPoc),
                cityCode: store.cityCode ? Number(store.cityCode) : null,
                isActive: true,
            };

            let response;
            if (store.enterOnEditing && store.isEditing.length > 0) {
                const idToUpdate = store.isEditing[0];
                response = await BrandMasterService.update(idToUpdate, payload);
            } else {
                response = await BrandMasterService.create(payload);
            }

            if (response.error) {
                console.error("Erro retornado pelo servidor:", response.err?.response?.data || response.message);
                toast.error(response.message || "Erro ao processar a solicitação.");
                return;
            }

            toast.success(store.enterOnEditing ? "Alterações salvas com sucesso!" : "MSP cadastrada com sucesso!");
            store.setModalOpen("createdMsp");
            onConfirm();

        } catch (error) {
            console.error("Erro técnico na requisição:", error);
            toast.error("Ocorreu um erro inesperado. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.size > 50 * 1024 * 1024) {
            toast.error("Máx 50MB");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            store.setBrandLogo({ brandLogoUrl: reader.result as string, brandObjectName: file.name });
        };
        reader.readAsDataURL(file);
    };

    return (
        <Stack sx={{ gap: "20px", width: "100%", maxWidth: "950px", padding: "8px", position: "relative" }}>
            <Stack sx={{ gap: "4px", width: "45%" }}>
                <Typography sx={{ color: theme[mode].primary, fontWeight: "600", fontSize: "14px" }}>Domínio do MSP</Typography>
                <Typography sx={{ color: theme[mode].primary, fontSize: "12px" }}>Domínio (Obrigatório)</Typography>
                <InputLabel placeholder="xx.xxx.xxx" value={store.mspDomain} onChange={(val) => handleFieldChange("mspDomain", val, store.setMSPDomain)} showEditIcon sx={inputStyle} error={fieldErrors.mspDomain} />
            </Stack>

            <Typography sx={{ color: theme[mode].primary, fontWeight: "600", fontSize: "14px" }}>Administrador principal da MSP</Typography>

            <Stack direction={{ xs: "column", md: "row" }} gap="20px">
                <Stack flex={1} gap="4px">
                    <Typography sx={{ color: theme[mode].primary, fontSize: "12px" }}>Nome completo (Obrigatório)</Typography>
                    <InputLabel value={store.admName} onChange={(val) => handleFieldChange("admName", val, store.setAdmName)} placeholder="José da Silva" showEditIcon sx={inputStyle} error={fieldErrors.admName} />
                </Stack>
                <Stack flex={1} gap="4px">
                    <Typography sx={{ color: theme[mode].primary, fontSize: "12px" }}>E-mail (Obrigatório)</Typography>
                    <InputLabel value={store.admEmail} onChange={(val) => handleFieldChange("admEmail", val, store.setAdmEmail)} placeholder="jose@email.com" showEditIcon sx={inputStyle} error={fieldErrors.admEmail} />
                </Stack>
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} gap="20px">
                <Stack flex={1} gap="4px">
                    <Typography sx={{ color: theme[mode].primary, fontSize: "12px" }}>Telefone</Typography>
                    <InputLabel value={store.admPhone} onChange={store.setAdmPhone} placeholder="(00) 00000-0000" showEditIcon sx={inputStyle} />
                </Stack>
                <Stack flex={1} gap="4px">
                    <Typography sx={{ color: theme[mode].primary, fontSize: "12px" }}>Cargo</Typography>
                    <InputLabel value={store.position} onChange={store.setPosition} showEditIcon sx={inputStyle} />
                </Stack>
                <Stack flex={1.5} gap="4px">
                    <Typography sx={{ color: theme[mode].primary, fontSize: "12px" }}>Senha inicial (Obrigatório)</Typography>
                    <InputLabel value="" placeholder="Gerada e enviada por e-mail" disabled sx={inputStyle} />
                </Stack>
                <Stack flex={1} gap="4px">
                    <Typography sx={{ color: theme[mode].primary, fontSize: "12px" }}>Nome de Usuário</Typography>
                    <InputLabel value={store.city} onChange={(val) => handleFieldChange("username", val, store.setCity)} placeholder="Nome de Usuário" showEditIcon sx={inputStyle} error={fieldErrors.username} />
                </Stack>
            </Stack>

            <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 1 }} />

            <Stack sx={{ gap: "12px" }}>
                <Typography sx={{ color: theme[mode].primary, fontWeight: "600", fontSize: "14px" }}>Logotipo da empresa</Typography>
                <Stack direction="row" gap="24px" alignItems="center">
                    <Box onClick={() => fileInputRef.current?.click()} sx={{ width: "220px", height: "130px", border: `1px dashed ${theme[mode].tertiary}`, borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", backgroundColor: "#2C313C", overflow: "hidden" }}>
                        {store.brandLogoUrl ? (
                            <img src={store.brandLogoUrl} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain", padding: "10px" }} />
                        ) : (
                            <><UploadIcon fill="#FFF" /><Typography sx={{ fontSize: "10px", textAlign: "center", mt: 1, color: "#FFF", px: 2 }}>Clique aqui para upload</Typography></>
                        )}
                        <input type="file" hidden ref={fileInputRef} accept=".svg,.png,.jpg,.gif,.webp" onChange={handleFileUpload} />
                    </Box>
                    <Stack sx={{ gap: "4px" }}>
                        <Typography onClick={() => fileInputRef.current?.click()} sx={{ color: theme[mode].blueMedium, cursor: "pointer", fontSize: "14px", textDecoration: "underline" }}>Alterar logo</Typography>
                        <Typography onClick={() => store.setBrandLogo({ brandLogoUrl: "", brandObjectName: "" })} sx={{ color: theme[mode].blueMedium, cursor: "pointer", fontSize: "14px", textDecoration: "underline" }}>Remover logo</Typography>
                    </Stack>
                </Stack>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center" mt={4}>
                <Stack direction="row" gap="16px">
                    <Btn onClick={handleConfirm} disabled={isSubmitting} sx={{ backgroundColor: theme[mode].blue, width: "200px", borderRadius: "12px", py: 1.2 }}>
                        {isSubmitting ? <CircularProgress size={20} color="inherit" /> : <TextRob16Font1S sx={{ color: theme[mode].btnText }}>{store.enterOnEditing ? "Salvar alterações" : "Confirmar cadastro"}</TextRob16Font1S>}
                    </Btn>
                    <Btn onClick={onBack} disabled={isSubmitting} sx={{ border: "1px solid #FFF", width: "200px", borderRadius: "12px", py: 1.2 }}>
                        <TextRob16Font1S sx={{ color: "#FFF" }}>Voltar</TextRob16Font1S>
                    </Btn>
                </Stack>
                <Typography onClick={handleClear} sx={{ color: theme[mode].primary, cursor: "pointer", fontSize: "14px", textDecoration: "underline" }}>Limpar</Typography>
            </Stack>
        </Stack>
    );
};