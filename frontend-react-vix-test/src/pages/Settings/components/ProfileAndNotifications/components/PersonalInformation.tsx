import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { TextRob16FontL } from "../../../../../components/TextL";
import { useZTheme } from "../../../../../stores/useZTheme";
import { InputLabelAndFeedback } from "../../../../../components/Inputs/InputLabelAndFeedback";
import { EditCirclePencilIcon } from "../../../../../icons/EditCirclePencilIcon";
import { useZUserProfile } from "../../../../../stores/useZUserProfile";
import {
  IFormProfileNotificationsVar,
  useZFormProfileNotifications,
} from "../../../../../stores/useZFormProfileNotifications";
import { useEffect } from "react";
import { PerfilPhotoUpload } from "./PerfilPhotoUpload";

export const PersonalInformation = () => {
  const { t } = useTranslation();
  const { theme, mode } = useZTheme();
  const { username, userEmail } = useZUserProfile();

  const {
    userEmail: userEmailForm,
    userName: userNameForm,
    userPhone,
    password,
    confirmPassword,
    fullNameForm,
    setFormProfileNotifications,
  } = useZFormProfileNotifications();

  const inputSx = {
    maxWidth: "400px",
    width: "100%",
    "@media (max-width: 745px)": {
      maxWidth: "100%",
    },
  };
  const sxContainer = {
    maxWidth: "400px",
    width: "100%",
    "@media (max-width: 745px)": {
      maxWidth: "100%",
    },
  };
  const sxLabel = {};
  const sxSideLabel = {};

  const validFullName = () => {
    if (!fullNameForm.value) {
      setFormProfileNotifications({
        fullNameForm: {
          ...fullNameForm,
          errorMessage: t("profileAndNotifications.requiredField"),
        },
      });
      return;
    }
    if (fullNameForm.value.length < 4 || fullNameForm.value.length > 100) {
      setFormProfileNotifications({
        fullNameForm: {
          ...fullNameForm,
          errorMessage: t("profileAndNotifications.invalidData"),
        },
      });
      return;
    }
    setFormProfileNotifications({
      fullNameForm: {
        ...fullNameForm,
        errorMessage: "",
      },
    });
    return true;
  };

  const validName = () => {
    if (!userNameForm.value) {
      setFormProfileNotifications({
        userName: {
          ...userNameForm,
          errorMessage: t("profileAndNotifications.requiredField"),
        },
      });
      return;
    }
    if (userNameForm.value.length < 4 || userNameForm.value.length > 100) {
      setFormProfileNotifications({
        userName: {
          ...userNameForm,
          errorMessage: t("profileAndNotifications.invalidData"),
        },
      });
      return;
    }
    setFormProfileNotifications({
      userName: {
        ...userNameForm,
        errorMessage: "",
      },
    });
    return true;
  };

  const validPassword = () => {
    if (password.value && password.value !== confirmPassword.value) {
      setFormProfileNotifications({
        password: {
          ...password,
          errorMessage: t("colaboratorRegister.dontMatch"),
        },
      });
      return;
    }
    setFormProfileNotifications({
      password: {
        ...password,
        errorMessage: "",
      },
    });
    return true;
  };

  const validEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userEmailForm.value) {
      return setFormProfileNotifications({
        userEmail: {
          ...userEmailForm,
          errorMessage: t("profileAndNotifications.requiredField"),
        },
      });
    }
    if (
      !emailRegex.test(userEmailForm.value) ||
      userEmailForm.value.length > 100
    ) {
      return setFormProfileNotifications({
        userEmail: {
          ...userEmailForm,
          errorMessage: t("profileAndNotifications.invalidData"),
        },
      });
    }
    return setFormProfileNotifications({
      userEmail: {
        ...userEmailForm,
        errorMessage: "",
      },
    });
  };

  const validPhoneNumber = () => {
    const phoneRegex = /^\d{10,11}$/;
    if (!userPhone.value) {
      return setFormProfileNotifications({
        userPhone: {
          ...userPhone,
          errorMessage: "",
        },
      });
    }
    if (!phoneRegex.test(userPhone.value) || userPhone.value.length > 20) {
      return setFormProfileNotifications({
        userPhone: {
          ...userPhone,
          errorMessage: t("profileAndNotifications.invalidData"),
        },
      });
    }
    return setFormProfileNotifications({
      userPhone: {
        ...userPhone,
        errorMessage: "",
      },
    });
  };

  const handleChange = (
    key: keyof IFormProfileNotificationsVar,
    val: string,
  ) => {
    setFormProfileNotifications({
      [key]: {
        ...[key],
        value: val,
      },
    });
  };

  useEffect(() => {
    setFormProfileNotifications({
      fullNameForm: {
        ...fullNameForm,
        value: "", 
        errorMessage: "",
      },
      userName: {
        ...userNameForm,
        value: username || "",
        errorMessage: "",
      },
      userEmail: {
        ...userEmailForm,
        value: userEmail || "",
        errorMessage: "",
      },
      userPhone: {
        ...userPhone,
        value: "", 
        errorMessage: "",
      },
      password: {
        ...password,
        value: "",
        errorMessage: "",
      },
      confirmPassword: {
        ...confirmPassword,
        value: "",
        errorMessage: "",
      },
    });
  }, [username, userEmail]);

  return (
    <Stack
      sx={{
        gap: "24px",
      }}
    >
      <Stack
        sx={{
          width: "100%",
        }}
      >
        <TextRob16FontL
          sx={{
            color: theme[mode].black,
            fontWeight: "500",
            lineHeight: "24px",
          }}
        >
          {t("profileAndNotifications.personalData")}
        </TextRob16FontL>
      </Stack>
      <Stack
        sx={{
          flexDirection: "row",
          gap: "24px",
          flexWrap: "wrap",
          "@media (max-width: 745px)": {
            flexDirection: "column",
          },
        }}
      >
        <InputLabelAndFeedback
          label={t("profileAndNotifications.completeName")}
          value={fullNameForm.value}
          onChange={(val) => handleChange("fullNameForm", val)}
          errorMessage={fullNameForm.errorMessage}
          icon={
            <EditCirclePencilIcon
              fill={
                fullNameForm.errorMessage
                  ? theme[mode].danger
                  : theme[mode].blueMedium
              }
            />
          }
          onBlur={validFullName}
          sx={inputSx}
          sxContainer={sxContainer}
          sxLabel={sxLabel}
          sxSidelabel={sxSideLabel}
        />
        <InputLabelAndFeedback
          label={t("profileAndNotifications.username")}
          value={userNameForm.value}
          onChange={(val) => handleChange("userName", val)}
          errorMessage={userNameForm.errorMessage}
          icon={
            <EditCirclePencilIcon
              fill={
                userNameForm.errorMessage
                  ? theme[mode].danger
                  : theme[mode].blueMedium
              }
            />
          }
          onBlur={validName}
          sx={inputSx}
          sxContainer={sxContainer}
          sxLabel={sxLabel}
          sxSidelabel={sxSideLabel}
        />
        <InputLabelAndFeedback
          label={t("profileAndNotifications.email")}
          value={userEmailForm.value}
          errorMessage={userEmailForm.errorMessage}
          onChange={(val) => handleChange("userEmail", val)}
          icon={
            <EditCirclePencilIcon
              fill={
                userEmailForm.errorMessage
                  ? theme[mode].danger
                  : theme[mode].blueMedium
              }
            />
          }
          onBlur={validEmail}
          sx={inputSx}
          sxContainer={sxContainer}
          sxLabel={sxLabel}
          sxSidelabel={sxSideLabel}
        />
        <InputLabelAndFeedback
          label={t("profileAndNotifications.phone")}
          placeholder="(00) 0000-0000"
          value={userPhone.value}
          errorMessage={userPhone.errorMessage}
          onBlur={validPhoneNumber}
          onChange={(val) => handleChange("userPhone", val)}
          icon={
            <EditCirclePencilIcon
              fill={
                userPhone.errorMessage
                  ? theme[mode].danger
                  : theme[mode].blueMedium
              }
            />
          }
          sx={inputSx}
          sxContainer={sxContainer}
          sxLabel={sxLabel}
          sxSidelabel={sxSideLabel}
        />
      </Stack>
      {/* Inputs line 02 */}
      <Stack
        sx={{
          flexDirection: "row",
          gap: "24px",
          "@media (max-width: 745px)": {
            flexDirection: "column",
          },
        }}
      >
        <InputLabelAndFeedback
          type="password"
          label={t("colaboratorRegister.password")}
          value={password.value}
          onChange={(val) => handleChange("password", val)}
          errorMessage={password.errorMessage}
          sx={inputSx}
          sxContainer={sxContainer}
          sxLabel={sxLabel}
          sxSidelabel={sxSideLabel}
        />
        <InputLabelAndFeedback
          type="password"
          label={t("colaboratorRegister.confirmPassword")}
          value={confirmPassword.value}
          onChange={(val) => handleChange("confirmPassword", val)}
          errorMessage={confirmPassword.errorMessage}
          onBlur={validPassword}
          sx={inputSx}
          sxContainer={sxContainer}
          sxLabel={sxLabel}
          sxSidelabel={sxSideLabel}
        />
      </Stack>
      <Stack
        sx={{
          width: "100%",
        }}
      >
        <PerfilPhotoUpload />
      </Stack>
    </Stack>
  );
};