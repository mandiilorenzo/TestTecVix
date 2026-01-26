import { useZUserProfile } from "../stores/useZUserProfile";
import { useZGlobalVar } from "../stores/useZGlobalVar";
import moment from "moment";
import { api } from "../services/api";

const REFRESH_TIME = 50;

export const useAuth = () => {
  const { token, setUser, idUser } = useZUserProfile();
  const { loginTime, setLoginTime } = useZGlobalVar();

  const fetchNewUserToken = async () => {
    if (!idUser) return null; 

    const response = await api.get<{ token: string | null }>({
      url: `/user/token/${idUser}`,
      tryRefetch: true,
    });

    if (response.error || !response.data?.token) {
      console.error("[useAuth]: Erro ao recuperar novo token");
      return null;
    }

    return response.data.token;
  };

  const getAuth = async (force = false) => {
    if (
      !force &&
      token &&
      token !== "undefined" && 
      loginTime &&
      moment(loginTime).add(REFRESH_TIME, "minutes") > moment()
    ) {
      return { Authorization: `Bearer ${token}` };
    }

    const newToken = await fetchNewUserToken();

    if (newToken) {
      setLoginTime(new Date());
      setUser({ token: newToken });
      return { Authorization: `Bearer ${newToken}` };
    }

    if (token && token !== "undefined") {
      return { Authorization: `Bearer ${token}` };
    }

    return null;
  };

  return {
    getAuth,
  };
};