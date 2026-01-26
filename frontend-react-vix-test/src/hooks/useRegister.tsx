import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { useZBrandInfo } from "../stores/useZBrandStore";
import { useNavigate } from "react-router-dom";
import { IRegisterResponse } from "../types/AuthTypes";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false); 
  const { t } = useTranslation();
  const { idBrand } = useZBrandInfo();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return t("loginRegister.invalidEmail");
    }
    return null;
  };

  const validatePasswords = (password: string, confirmPassword: string) => {
    if (!password) return t("loginRegister.invalidPassword");
    if (password !== confirmPassword) {
      return t("loginRegister.passwordMismatch");
    }
    return null;
  };

  const goRegister = async ({
    username,
    password,
    email,
    confirmPassword,
  }: {
    username: string;
    password: string;
    email: string;
    confirmPassword: string;
  }) => {
    if (!username) {
      toast.error(t("loginRegister.invalidUsername"));
      return;
    }
    const emailError = validateEmail(email);
    const passwordError = validatePasswords(password, confirmPassword);

    if (emailError || passwordError) {
      toast.error(emailError || passwordError);
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.post<IRegisterResponse>({
        url: "/auth/register",
        data: {
          username: username.trim(), 
          password: password.trim(),
          email: email.trim(),
          idBrandMaster: idBrand || null, 
        },
      });

      if (response.error) {
        toast.error(response.message || "Erro ao criar conta.");
        return;
      }

      toast.success(t("Cadastro realizado com sucesso! Faça login.")); 
      navigate("/login");

    } catch (error) {
      console.error(error);
      toast.error("Erro inesperado ao tentar registrar.");
    } finally {
      setIsLoading(false);
    }
  };

  return { goRegister, isLoading };
};