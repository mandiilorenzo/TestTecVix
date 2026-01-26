import { useState } from "react";
import { api } from "../services/api";
import { toast } from "react-toastify";
import { useZGlobalVar } from "../stores/useZGlobalVar";
import { useZUserProfile } from "../stores/useZUserProfile";
import { useNavigate } from "react-router-dom";
import { useZResetAllStates } from "../stores/useZResetAllStates";
import { IUserLoginResponse } from "../types/AuthTypes";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { setIsOpenModalUserNotActive, setLoginTime } = useZGlobalVar();
  const { setUser } = useZUserProfile();
  const { resetAllStates } = useZResetAllStates();
  const navigate = useNavigate();

  const goLogin = async ({
    username,
    password,
    email,
  }: {
    username: string;
    password: string;
    email: string;
  }) => {
    if (!password || (!username && !email)) {
      toast.warn("Por favor, preencha suas credenciais.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.post<IUserLoginResponse>({
        url: "/auth/login",
        data: {
          username: username?.trim(),
          email: email?.trim(),
          password: password.trim(), 
        },
      });

      if (response.error) {
        toast.error(response.message || "Falha ao realizar login");
        return;
      }

      const userData = response.data.user;

      if (!userData?.isActive) {
        setIsOpenModalUserNotActive(true);
        return;
      }

      setUser({
        idUser: userData.idUser, 
        username: userData.username,
        userEmail: userData.email,
        role: userData.role,
        idBrand: userData.idBrand,
        token: response.data.token,
        profileImgUrl: userData.profileImgUrl,
      });

      setLoginTime(new Date());
      toast.success(`Bem-vindo(a), ${userData.username}!`);

      navigate("/");

    } catch (error) {
      console.error(error);
      toast.error("Erro inesperado. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const goLogout = () => {
    resetAllStates();
    navigate("/login");
  };

  return { goLogin, isLoading, goLogout };
};