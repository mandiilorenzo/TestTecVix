import { Typography, MenuItem, IconButton, InputAdornment, TextField, CircularProgress, Grid, Box, Paper, Button } from "@mui/material";
import { useZTheme } from "../../../stores/useZTheme";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EditIcon from "@mui/icons-material/Edit"; 
import { userService, ICreateUserDTO } from "../../../services/UserService";
import { z } from "zod"; 

interface UserFormProps {
    onSuccess: () => void;
}

const createUserSchema = z.object({
    fullName: z.string().min(1, "Nome Completo é obrigatório"),
    email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
    username: z.string().min(1, "Nome de Usuário é obrigatório"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirmação é obrigatória"),
    position: z.string().min(1, "Cargo é obrigatório"),
    role: z.string().min(1, "Permissão é obrigatória"),
    status: z.string(),
    companyId: z.string().min(1, "Selecione uma empresa"),
    phone: z.string().optional(),
    department: z.string().optional(),
    hiringDate: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
});

export const UserForm = ({ onSuccess }: UserFormProps) => {
    const { theme, mode } = useZTheme();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [permission, setPermission] = useState("member");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [position, setPosition] = useState("");
    const [department, setDepartment] = useState("");
    const [hiringDate, setHiringDate] = useState("");
    const [status, setStatus] = useState("ACTIVE");
    const [companyId, setCompanyId] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [companies, setCompanies] = useState<{ id: string, name: string }[]>([]);

    const [errors, setErrors] = useState<Record<string, string>>({});

    const inputStyle = {
        "& .MuiOutlinedInput-root": {
            backgroundColor: "#2C313C", 
            borderRadius: "12px",
            color: "#FFF",
            height: "56px",
            "& fieldset": { border: "none" },
            "&:hover fieldset": { border: "none" },
            "&.Mui-focused fieldset": { border: `1px solid ${theme[mode].primary}` }, 
            "&.Mui-error fieldset": { border: "1px solid #d32f2f" }, 
        },
        "& .MuiInputLabel-root": {
            color: theme[mode].tertiary,
            "&.Mui-focused": { color: theme[mode].primary },
            "&.Mui-error": { color: "#d32f2f" },
        },
        "& .MuiInputBase-input": {
            color: "#FFFFFF !important",
            WebkitTextFillColor: "#FFFFFF !important",
            "&::placeholder": { color: theme[mode].tertiary, opacity: 1 },
            "&::-webkit-calendar-picker-indicator": { filter: "invert(1)", cursor: "pointer" }
        },
        "& .MuiSvgIcon-root": { color: theme[mode].tertiary },
        "& .MuiSelect-icon": { color: theme[mode].tertiary },
        "& .MuiFormHelperText-root": { marginLeft: 0, fontSize: "11px" }
    };

    const EditAdornment = () => (
        <InputAdornment position="end">
            <EditIcon sx={{ fontSize: "18px", color: theme[mode].tertiary }} />
        </InputAdornment>
    );

    useEffect(() => {
        setCompanies([
            { id: "1", name: "Megas MSP Test" },
            { id: "2", name: "Outra Empresa LTDA" }
        ]);
    }, []);

    const handleClear = () => {
        setFullName(""); setEmail(""); setPhone("");
        setUsername(""); setPassword(""); setConfirmPassword("");
        setPosition(""); setDepartment("");
        setPermission("member");
        setHiringDate(""); setStatus("ACTIVE"); setCompanyId("");
        setErrors({}); 
    };

    const handleSave = async () => {
        const formData = {
            fullName, email, username, password, confirmPassword,
            position, role: permission, status, companyId,
            phone, department, hiringDate
        };

        const result = createUserSchema.safeParse(formData);

        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                newErrors[issue.path[0] as string] = issue.message;
            });
            setErrors(newErrors);
            toast.warning("Verifique os campos obrigatórios.");
            return;
        }

        setErrors({});

        try {
            setIsSubmitting(true);
            const payload: ICreateUserDTO = {
                fullName, email, phone, username, password,
                position, department, hiringDate, role: permission,
                isActive: status === "ACTIVE",
                idBrandMaster: Number(companyId),
            };

            const response = await userService.create(payload);
            if (response.error) {
                toast.error(response.message || "Erro ao criar funcionário");
            } else {
                toast.success("Funcionário cadastrado com sucesso!");
                handleClear();
                onSuccess();
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro técnico ao salvar.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Paper elevation={0} sx={{
            width: "100%",
            backgroundColor: theme[mode].mainBackground,
            borderRadius: "16px",
            padding: { xs: "20px", md: "32px" },
            boxSizing: "border-box"
        }}>
            <Box sx={{ mb: 4 }}>
                <Typography sx={{ color: "#FFF", fontSize: { xs: "18px", md: "20px" }, fontWeight: 600 }}>
                    Atribuir e ajustar níveis de acesso do usuário
                </Typography>
            </Box>

            <Grid container spacing={3}>

                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth label="Nome Completo *" placeholder="John Doe"
                        value={fullName} onChange={e => setFullName(e.target.value)}
                        sx={inputStyle}
                        error={!!errors.fullName}
                        helperText={errors.fullName}
                        InputProps={{ endAdornment: <EditAdornment /> }} 
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth label="E-mail *" placeholder="john@email.com"
                        value={email} onChange={e => setEmail(e.target.value)}
                        sx={inputStyle}
                        error={!!errors.email}
                        helperText={errors.email}
                        InputProps={{ endAdornment: <EditAdornment /> }}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth label="Telefone" placeholder="(00) 00000-0000"
                        value={phone} onChange={e => setPhone(e.target.value)}
                        sx={inputStyle}
                        InputProps={{ endAdornment: <EditAdornment /> }}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth label="Nome de Usuário *" placeholder="username"
                        value={username} onChange={e => setUsername(e.target.value)}
                        sx={inputStyle}
                        error={!!errors.username}
                        helperText={errors.username}
                        InputProps={{ endAdornment: <EditAdornment /> }}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth label="Senha *" placeholder="********" type={showPassword ? "text" : "password"}
                        value={password} onChange={e => setPassword(e.target.value)}
                        sx={inputStyle}
                        error={!!errors.password}
                        helperText={errors.password}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth label="Confirmar Senha *" placeholder="********" type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                        sx={inputStyle}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth label="Cargo *" placeholder="Analista"
                        value={position} onChange={e => setPosition(e.target.value)}
                        sx={inputStyle}
                        error={!!errors.position}
                        helperText={errors.position}
                        InputProps={{ endAdornment: <EditAdornment /> }}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth label="Departamento" placeholder="Suporte"
                        value={department} onChange={e => setDepartment(e.target.value)}
                        sx={inputStyle}
                        InputProps={{ endAdornment: <EditAdornment /> }}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField select fullWidth label="Permissão de Usuário *" value={permission} onChange={e => setPermission(e.target.value)} sx={inputStyle}>
                        <MenuItem value="member">Usuário Comum (member)</MenuItem>
                        <MenuItem value="manager">Gerente (manager)</MenuItem>
                        <MenuItem value="admin">Administrador (admin)</MenuItem>
                    </TextField>
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth type="date" label="Data de Contratação"
                        value={hiringDate} onChange={e => setHiringDate(e.target.value)}
                        sx={inputStyle}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField select fullWidth label="Status *" value={status} onChange={e => setStatus(e.target.value)} sx={inputStyle}>
                        <MenuItem value="ACTIVE">Ativo</MenuItem>
                        <MenuItem value="INACTIVE">Inativo</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        select fullWidth label="Nome da Empresa *"
                        value={companyId} onChange={e => setCompanyId(e.target.value)}
                        sx={inputStyle}
                        SelectProps={{ displayEmpty: true }}
                        error={!!errors.companyId}
                        helperText={errors.companyId}
                    >
                        <MenuItem value="" disabled>Selecione uma empresa</MenuItem>
                        {companies.map((comp) => (
                            <MenuItem key={comp.id} value={comp.id}>{comp.name}</MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" }, mt: 2 }}>
                        <Button
                            onClick={handleSave}
                            disabled={isSubmitting}
                            sx={{
                                backgroundColor: theme[mode].blue,
                                color: theme[mode].btnText,
                                borderRadius: "12px",
                                height: "48px",
                                minWidth: "160px",
                                textTransform: "none",
                                fontSize: "16px",
                                fontWeight: 600,
                                "&:hover": { backgroundColor: theme[mode].blueDark }
                            }}
                        >
                            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Salvar"}
                        </Button>
                        <Button
                            onClick={handleClear}
                            sx={{
                                border: "1px solid rgba(255,255,255,0.3)",
                                color: "#FFF",
                                borderRadius: "12px",
                                height: "48px",
                                minWidth: "160px",
                                textTransform: "none",
                                fontSize: "16px",
                                fontWeight: 600,
                                "&:hover": { border: "1px solid #FFF", backgroundColor: "rgba(255,255,255,0.05)" }
                            }}
                        >
                            Limpar
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};