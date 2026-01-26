import { Button, Stack, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useZTheme } from "../../../../../stores/useZTheme";
import { TextRob16FontL } from "../../../../../components/TextL";
import { toast } from "react-toastify";
import { useState } from "react";
import { useZFormProfileNotifications } from "../../../../../stores/useZFormProfileNotifications";
import { useZUserProfile } from "../../../../../stores/useZUserProfile";
import { userService } from "../../../../../services/UserService";

export const CTAsButtons = () => {
  const { t } = useTranslation();
  const { theme, mode } = useZTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { username, userEmail, setUser } = useZUserProfile();

  const {
    fullNameForm,
    userName: userNameForm,
    userEmail: userEmailForm,
    userPhone,
    password,
    confirmPassword,
    setFormProfileNotifications
  } = useZFormProfileNotifications();

  const handleReset = () => {
    setFormProfileNotifications({
      userName: { ...userNameForm, value: username || "", errorMessage: "" },
      userEmail: { ...userEmailForm, value: userEmail || "", errorMessage: "" },
      fullNameForm: { ...fullNameForm, value: "", errorMessage: "" },
      userPhone: { ...userPhone, value: "", errorMessage: "" },
      password: { ...password, value: "", errorMessage: "" },
      confirmPassword: { ...confirmPassword, value: "", errorMessage: "" }
    });
    toast.info(t("profileAndNotifications.redefineAll", "Dados redefinidos."));
  };

  const handleSave = async () => {
    if (!userNameForm.value || !userEmailForm.value) {
      toast.warning(t("profileAndNotifications.requiredField", "Preencha os campos obrigatórios."));
      return;
    }

    setIsSubmitting(true);
    try {
      const personalPayload = {
        username: userNameForm.value,
        fullName: fullNameForm.value,
        email: userEmailForm.value,
        phone: userPhone.value
      };

      const responseUser = await userService.updateMe(personalPayload);

      if (responseUser.error) {
        throw new Error(responseUser.message || "Erro ao atualizar dados pessoais.");
      }

      if (password.value) {
        if (password.value.length < 6) {
          toast.warning("A senha deve ter no mínimo 6 caracteres.");
          setIsSubmitting(false);
          return;
        }
        if (password.value !== confirmPassword.value) {
          toast.error(t("colaboratorRegister.dontMatch", "As senhas não coincidem."));
          setIsSubmitting(false);
          return;
        }

        const responsePass = await userService.updatePasswordMe({
          newPassword: password.value
        });

        if (responsePass.error) {
          throw new Error(responsePass.message || "Erro ao atualizar senha.");
        }
      }

      toast.success(t("generic.dataSavesuccess", "Dados salvos com sucesso!"));

      setUser({
        username: userNameForm.value,
        userEmail: userEmailForm.value,
      });

      setFormProfileNotifications({
        password: { ...password, value: "" },
        confirmPassword: { ...confirmPassword, value: "" }
      });

    } catch (error) {
      console.error(error);
      toast.error(error.message || t("profileAndNotifications.errorForm", "Erro ao salvar dados."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack
      flexDirection={"row"}
      sx={{
        gap: "24px",
        "@media (max-width: 745px)": {
          flexDirection: "column",
        },
      }}
    >
      <Button
        disabled={isSubmitting}
        onClick={handleSave}
        sx={{
          background: theme[mode].blue,
          border: `1px solid ${theme[mode].blue}`,
          textTransform: "none",
          borderRadius: "12px",
          height: "48px",
          fontWeight: "500",
          fontSize: "16px",
          width: "100%",
          maxWidth: "330px",
          "&:hover": {
            background: theme[mode].blueDark,
          },
          "@media (max-width: 745px)": {
            maxWidth: "100%",
          },
        }}
      >
        <TextRob16FontL
          sx={{
            color: theme[mode].btnText,
            fontWeight: "500",
            fontFamily: "Roboto",
            lineHeight: "16px",
          }}
        >
          {isSubmitting ? <CircularProgress size={20} color="inherit" /> : t("profileAndNotifications.saveChanges")}
        </TextRob16FontL>
      </Button>

      <Button
        disabled={isSubmitting}
        onClick={handleReset}
        sx={{
          background: "transparent",
          border: `1px solid ${theme[mode].blueDark}`,
          textTransform: "none",
          borderRadius: "12px",
          height: "48px",
          fontWeight: "500",
          fontSize: "16px",
          width: "100%",
          maxWidth: "330px",
          "@media (max-width: 745px)": {
            maxWidth: "100%",
          },
        }}
      >
        <TextRob16FontL
          sx={{
            color: theme[mode].blueDark,
            fontWeight: "500",
            fontFamily: "Roboto",
            lineHeight: "16px",
          }}
        >
          {t("profileAndNotifications.redefineAllData")}
        </TextRob16FontL>
      </Button>
    </Stack>
  );
};