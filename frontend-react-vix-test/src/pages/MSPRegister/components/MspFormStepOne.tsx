import { Stack, FormControlLabel, Checkbox, Typography, Divider } from "@mui/material";
import { InputLabel } from "../../../components/Inputs/Input";
import { useZMspRegisterPage } from "../../../stores/useZMspRegisterPage";
import { useZTheme } from "../../../stores/useZTheme";
import { Btn } from "../../../components/Buttons/Btn";
import { TextRob16Font1S } from "../../../components/Text1S";
import { useState } from "react";
import { mspStepOneSchema } from "../../../utils/mspSchema";

export const MspFormStepOne = ({ onNext, onCancel }: { onNext: () => void; onCancel: () => void }) => {
    const { theme, mode } = useZTheme();
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const store = useZMspRegisterPage();

    const handleCepBlur = async (currentCep: string) => {
        const cleanCep = currentCep.replace(/\D/g, "");
        if (cleanCep.length !== 8) return;
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await response.json();
            if (!data.erro) {
                store.setCity(data.localidade);
                store.setDistrict(data.bairro);
                store.setStreet(data.logradouro);
                store.setCountryState(data.uf);
                setFieldErrors(prev => ({ ...prev, cep: "" }));
            }
        } catch (error) { console.error(error); }
    };

    const handleNextStep = () => {
        const result = mspStepOneSchema.safeParse({
            companyName: store.companyName || "",
            cnpj: store.cnpj || "",
            phone: store.phone || "",
            sector: store.sector || "",
            contactEmail: store.contactEmail || "",
            cep: store.cep || "",
            locality: store.locality || "",
        });

        if (!result.success) {
            const errors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                errors[issue.path[0] as string] = issue.message;
            });
            setFieldErrors(errors);
        } else {
            setFieldErrors({});
            onNext();
        }
    };

    const handleCancelAction = () => {
        store.resetAll(); 
        setFieldErrors({});
        onCancel();
    };

    const inputStyle = {
        backgroundColor: "#2C313C",
        "& .MuiInputBase-input": {
            color: "#FFFFFF !important",
            "-webkit-text-fill-color": "#FFFFFF !important",
        },
        "& .MuiInputBase-input::placeholder": {
            color: `${theme[mode].tertiary} !important`,
            "-webkit-text-fill-color": `${theme[mode].tertiary} !important`,
            opacity: 1,
        }
    };

    return (
        <Stack sx={{ width: "100%", gap: "20px", padding: "8px", maxWidth: "900px" }}>
            <Typography sx={{ color: theme[mode].primary, fontWeight: "500", fontSize: "18px", mb: 1 }}>
                Informações da empresa MSP
            </Typography>

            <Stack direction={{ xs: "column", md: "row" }} gap="20px">
                <Stack flex={1} gap="4px">
                    <Typography sx={{ color: theme[mode].primary, fontSize: "12px" }}>Nome da empresa MSP (Obrigatório)</Typography>
                    <InputLabel value={store.companyName} onChange={store.setCompanyName} placeholder="Vituax" showEditIcon sx={inputStyle} error={fieldErrors.companyName} />
                </Stack>
                <Stack flex={1} gap="4px">
                    <Typography sx={{ color: theme[mode].primary, fontSize: "12px" }}>Localização (Obrigatório)</Typography>
                    <InputLabel value={store.locality} onChange={store.setLocality} placeholder="Ex: Brasil" showEditIcon sx={inputStyle} error={fieldErrors.locality} />
                </Stack>
                <Stack flex={1} gap="4px">
                    <Typography sx={{ color: theme[mode].primary, fontSize: "12px" }}>CNPJ (Obrigatório)</Typography>
                    <InputLabel value={store.cnpj} onChange={store.setCnpj} placeholder="00.000.000/0001-00" showEditIcon sx={inputStyle} error={fieldErrors.cnpj} />
                </Stack>
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} gap="20px">
                <Stack flex={1} gap="4px">
                    <Typography sx={{ color: theme[mode].primary, fontSize: "12px" }}>Telefone</Typography>
                    <InputLabel value={store.phone} onChange={store.setPhone} placeholder="(00) 00000-0000" showEditIcon sx={inputStyle} />
                </Stack>
                <Stack flex={1} gap="4px">
                    <Typography sx={{ color: theme[mode].primary, fontSize: "12px" }}>Setor de atuação (Obrigatório)</Typography>
                    <InputLabel value={store.sector} onChange={store.setSector} placeholder="Telecom" showEditIcon sx={inputStyle} error={fieldErrors.sector} />
                </Stack>
                <Stack flex={1} gap="4px">
                    <Typography sx={{ color: theme[mode].primary, fontSize: "12px" }}>E-mail de contato (Obrigatório)</Typography>
                    <InputLabel value={store.contactEmail} onChange={store.setContactEmail} placeholder="vituax@gmail.com" showEditIcon sx={inputStyle} error={fieldErrors.contactEmail} />
                </Stack>
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} gap="20px">
                <Stack flex={0.4} gap="4px">
                    <Typography sx={{ color: theme[mode].primary, fontSize: "12px" }}>CEP</Typography>
                    <InputLabel
                        value={store.cep}
                        onChange={(v) => {
                            store.setCep(v);
                            if (v.replace(/\D/g, "").length === 8) handleCepBlur(v);
                        }}
                        placeholder="00000-000"
                        showEditIcon
                        sx={inputStyle}
                        error={fieldErrors.cep}
                    />
                </Stack>
                <Stack flex={1} gap="4px">
                    <Typography sx={{ color: theme[mode].primary, fontSize: "12px" }}>Cidade</Typography>
                    <InputLabel
                        value={store.enterOnEditing && /\d/.test(store.city) ? "" : store.city}
                        disabled
                        placeholder="Preenchido via CEP"
                        sx={inputStyle}
                    />
                </Stack>
                <Stack flex={0.6} gap="4px">
                    <Typography sx={{ color: theme[mode].primary, fontSize: "12px" }}>Estado</Typography>
                    <InputLabel value={store.countryState} disabled placeholder="UF" sx={inputStyle} />
                </Stack>
            </Stack>

            <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 1 }} />

            <Stack direction={{ xs: "column", md: "row" }} gap="24px" alignItems="center">
                <Stack flex={1} gap="4px" sx={{ width: "100%" }}>
                    <Typography sx={{ color: theme[mode].primary, fontSize: "12px" }}>Consumo mínimo (em R$)</Typography>
                    <InputLabel type="number" value={store.cityCode || ""} onChange={(v) => store.setCityCode(v)} sx={inputStyle} />
                </Stack>
                <Stack flex={1} gap="4px" sx={{ width: "100%" }}>
                    <Typography sx={{ color: theme[mode].primary, fontSize: "12px" }}>Porcentagem de desconto</Typography>
                    <InputLabel type="number" value={store.district || ""} onChange={(v) => store.setDistrict(v)} sx={inputStyle} />
                </Stack>
                <Stack flex={1} mt={{ xs: 0, md: 3 }} sx={{ width: "100%" }}>
                    <FormControlLabel
                        control={<Checkbox checked={store.isPoc} onChange={(e) => store.setIsPoc(e.target.checked)} />}
                        label="MSP em fase de POC"
                        sx={{ color: theme[mode].primary }}
                    />
                </Stack>
            </Stack>

            <Stack direction="row" gap="16px" mt={2}>
                <Btn onClick={handleNextStep} sx={{ backgroundColor: theme[mode].blue, width: "200px", borderRadius: "12px", py: 1.2 }}>
                    <TextRob16Font1S sx={{ color: theme[mode].btnText }}>Continuar</TextRob16Font1S>
                </Btn>
                <Btn onClick={handleCancelAction} sx={{ border: "1px solid #FFF", width: "200px", borderRadius: "12px", py: 1.2 }}>
                    <TextRob16Font1S sx={{ color: "#FFF" }}>Cancelar</TextRob16Font1S>
                </Btn>
            </Stack>
        </Stack>
    );
};