import { Stack, Box, CircularProgress } from "@mui/material";
import { ScreenFullPage } from "../../components/ScreenFullPage";
import { TextRob20Font1MB } from "../../components/Text1MB";
import { useZTheme } from "../../stores/useZTheme";
import { useTranslation } from "react-i18next";
import { TextRob16Font1S } from "../../components/Text1S";
import { useState, useEffect, useCallback } from "react";
import { UserForm } from "./components/UserForm";
import { UserTable } from "./components/UserTable";
import { userService } from "../../services/UserService";
import { toast } from "react-toastify";
import { useZUserProfile } from "../../stores/useZUserProfile";

export interface IUserList {
    idUser: string;
    username: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    brandMaster?: {
        brandName: string | null;
    };
}

export const UserRegisterPage = () => {
    const { theme, mode } = useZTheme();
    const { t } = useTranslation();
    const [users, setUsers] = useState<IUserList[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const token = useZUserProfile(state => state.token);

    const fetchUsers = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const response = await userService.getAll();
            if (response.error) {
                console.error("Erro API:", response.err);
                if (response.statusCode !== 401) {
                    toast.error("Erro ao carregar lista.");
                }
            } else {
                setUsers((response.data as unknown as IUserList[]) || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return (
        <ScreenFullPage
            title={
                <Stack
                    spacing={3} 
                    sx={{
                        marginTop: { xs: "32px", md: "40px" },
                        marginBottom: { xs: "40px", md: "32px" }, 
                        position: "relative",
                        zIndex: 1 
                    }}
                >
                    <TextRob20Font1MB sx={{ color: theme[mode].primary, fontSize: { xs: "24px", md: "28px" }, fontWeight: "500" }}>
                        {t("userRegister.title", "Cadastro de Funcionários | Permissões")}
                    </TextRob20Font1MB>
                    <TextRob16Font1S sx={{ color: theme[mode].tertiary, fontSize: "14px" }}>
                        Atribua e ajuste níveis de acesso
                    </TextRob16Font1S>
                </Stack>
            }
            sxTitleSubTitle={{ padding: { xs: "0 20px", md: "0 40px" } }}
            sxContainer={{ padding: { xs: "0 20px 80px", md: "0 40px 40px" } }}
        >
            <Stack sx={{
                width: "100%",
                gap: "26px",
                maxWidth: "100%",
                overflow: "hidden",
                marginTop: { xs: "100px", md: "0" }
            }}>

                <UserForm onSuccess={fetchUsers} />

                <Stack
                    sx={{
                        background: theme[mode].mainBackground,
                        borderRadius: "16px",
                        width: "100%",
                        padding: { xs: "16px", md: "24px" },
                        boxSizing: "border-box",
                        gap: "24px",
                        maxWidth: "100%",
                        overflow: "hidden"
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <TextRob16Font1S sx={{ color: theme[mode].black, fontWeight: 500 }}>
                            {t("userRegister.tableTitle", "Funcionários cadastrados")}
                        </TextRob16Font1S>
                    </Box>

                    {isLoading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                            <CircularProgress sx={{ color: theme[mode].primary }} />
                        </Box>
                    ) : (
                        <UserTable
                            data={users}
                            onEdit={(u) => console.log("Edit", u)}
                            onDelete={(id) => console.log("Delete", id)}
                        />
                    )}
                </Stack>
            </Stack>
        </ScreenFullPage>
    );
};