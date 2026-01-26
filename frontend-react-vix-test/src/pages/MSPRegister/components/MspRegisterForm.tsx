import { Paper, Box } from "@mui/material";
import { useZTheme } from "../../../stores/useZTheme";
import { useZMspRegisterPage } from "../../../stores/useZMspRegisterPage";
import { SampleStepper } from "../../../components/SampleStepper";
import { useTranslation } from "react-i18next";
import { MspFormStepOne } from "./MspFormStepOne";
import { MspFormStepTwo } from "./MspFormStepTwo";

export const MspRegisterForm = () => {
    const { theme, mode } = useZTheme();
    const { t } = useTranslation();
    const { activeStep, setActiveStep, resetAll, setModalOpen } = useZMspRegisterPage();
    const handleNext = () => setActiveStep(1);
    const handleBack = () => setActiveStep(0);

    const handleReset = () => {
        resetAll();
        setActiveStep(0);
        setModalOpen(null);
    };

    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                backgroundColor: theme[mode].mainBackground,
                borderRadius: "16px",
                padding: { xs: "24px", md: "32px" },
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: "32px",
                alignItems: "flex-start", 
                overflow: "hidden" 
            }}
        >
            <Box sx={{ width: "100%", maxWidth: "900px" }}>
                <SampleStepper
                    activeStep={activeStep}
                    stepsNames={[
                        t("mspRegister.stepOneTitle", "Informações da empresa MSP"),
                        t("mspRegister.stepTwoTitle", "Administrador principal da MSP"),
                    ]}
                />
            </Box>

            <Box sx={{ width: "100%" }}>
                {activeStep === 0 ? (
                    <MspFormStepOne
                        onNext={handleNext}
                        onCancel={handleReset}
                    />
                ) : (
                    <MspFormStepTwo
                        onBack={handleBack}
                        onConfirm={handleReset}
                    />
                )}
            </Box>
        </Paper>
    );
};