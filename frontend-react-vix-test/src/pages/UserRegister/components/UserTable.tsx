import {
    Table, TableBody, TableCell, TableContainer, TableRow,
    Paper, Avatar, Stack, Typography, IconButton, Box
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { useZTheme } from "../../../stores/useZTheme";
import { TextRob16Font1S } from "../../../components/Text1S";

interface UserData {
    idUser: string;
    username: string;
    email: string;
    role: string;
    isActive: boolean;
    brandMaster?: {
        brandName: string | null;
    };
}

interface UserTableProps {
    data: UserData[];
    onEdit: (user: UserData) => void;
    onDelete: (id: string) => void;
}

export const UserTable = ({ data, onEdit, onDelete }: UserTableProps) => {
    const { theme, mode } = useZTheme();
    const borderStyle = "1px solid rgba(255, 255, 255, 0.1)";

    return (
        <TableContainer
            component={Paper}
            sx={{
                backgroundColor: "transparent",
                boxShadow: "none",
                overflowX: "auto",
                '&::-webkit-scrollbar': {
                    height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    background: theme[mode].mainBackground,
                },
                '&::-webkit-scrollbar-thumb': {
                    background: theme[mode].tertiary,
                    borderRadius: '4px',
                }
            }}
        >
            <Table sx={{
                minWidth: { xs: "600px", sm: "700px", md: "800px" }, 
                width: "100%"
            }}>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={4}
                                align="center"
                                sx={{
                                    borderBottom: "none",
                                    py: { xs: 3, md: 4 } 
                                }}
                            >
                                <Typography sx={{
                                    color: theme[mode].tertiary,
                                    fontSize: { xs: "14px", sm: "16px" } 
                                }}>
                                    Nenhum funcionário encontrado.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row) => (
                            <TableRow
                                key={row.idUser}
                                sx={{
                                    "&:last-child td, &:last-child th": { border: 0 },
                                    borderBottom: borderStyle,
                                }}
                            >
                                <TableCell
                                    component="th"
                                    scope="row"
                                    sx={{
                                        borderBottom: borderStyle,
                                        py: { xs: 1.5, sm: 2 }, 
                                        minWidth: { xs: "200px", sm: "250px" } 
                                    }}
                                >
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        gap={{ xs: 1, sm: 2 }} 
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: theme[mode].tertiary,
                                                width: { xs: 32, sm: 40 }, 
                                                height: { xs: 32, sm: 40 },
                                                fontSize: { xs: "14px", sm: "16px" }
                                            }}
                                        >
                                            {row.username.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Stack sx={{ minWidth: 0 }}> 
                                            <TextRob16Font1S sx={{
                                                color: "#FFF",
                                                fontWeight: 600,
                                                fontSize: { xs: "14px", sm: "16px" }, 
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis"
                                            }}>
                                                {row.brandMaster?.brandName || "Sem Empresa"}
                                            </TextRob16Font1S>
                                            <Typography sx={{
                                                color: theme[mode].tertiary,
                                                fontSize: { xs: "11px", sm: "12px" }, 
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis"
                                            }}>
                                                {row.email}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </TableCell>

                                <TableCell
                                    sx={{
                                        borderBottom: borderStyle,
                                        display: { xs: "none", sm: "table-cell" } 
                                    }}
                                >
                                    <Stack>
                                        <Typography sx={{
                                            color: "#FFF",
                                            fontSize: { sm: "14px", md: "14px" },
                                            fontWeight: 600
                                        }}>
                                            Status
                                        </Typography>
                                        <Typography sx={{
                                            color: theme[mode].tertiary,
                                            fontSize: { sm: "11px", md: "12px" }
                                        }}>
                                            Last activity: --/--/----
                                        </Typography>
                                    </Stack>
                                </TableCell>

                                <TableCell
                                    sx={{
                                        borderBottom: borderStyle,
                                        minWidth: { xs: "180px", sm: "220px" } 
                                    }}
                                    align="right"
                                >
                                    <Stack
                                        direction="row"
                                        gap={{ xs: 0.5, sm: 1 }} 
                                        justifyContent="flex-end"
                                        alignItems="center"
                                        flexWrap="wrap" 
                                    >
                                        <Box sx={{
                                            border: `1px solid ${theme[mode].tertiary}`,
                                            borderRadius: "16px",
                                            px: { xs: 1, sm: 1.5 }, 
                                            py: { xs: 0.25, sm: 0.5 },
                                            marginBottom: { xs: "2px", sm: 0 }
                                        }}>
                                            <Typography sx={{
                                                color: "#FFF",
                                                fontSize: { xs: "10px", sm: "12px" } 
                                            }}>
                                                {row.role}
                                            </Typography>
                                        </Box>

                                        <Box sx={{
                                            border: `1px solid ${theme[mode].tertiary}`,
                                            borderRadius: "16px",
                                            px: { xs: 1, sm: 1.5 },
                                            py: { xs: 0.25, sm: 0.5 },
                                            marginBottom: { xs: "2px", sm: 0 }
                                        }}>
                                            <Typography sx={{
                                                color: "#FFF",
                                                fontSize: { xs: "10px", sm: "12px" }
                                            }}>
                                                {row.brandMaster?.brandName || "N/A"}
                                            </Typography>
                                        </Box>

                                        <Box sx={{
                                            border: `1px solid ${row.isActive ? "#4CAF50" : "#F44336"}`,
                                            borderRadius: "16px",
                                            px: { xs: 1, sm: 1.5 },
                                            py: { xs: 0.25, sm: 0.5 },
                                            marginBottom: { xs: "2px", sm: 0 }
                                        }}>
                                            <Typography sx={{
                                                color: row.isActive ? "#4CAF50" : "#F44336",
                                                fontSize: { xs: "10px", sm: "12px" }
                                            }}>
                                                {row.isActive ? "Active" : "Inactive"}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </TableCell>

                                <TableCell
                                    sx={{
                                        borderBottom: borderStyle,
                                        minWidth: { xs: "80px", sm: "100px" } 
                                    }}
                                    align="right"
                                >
                                    <Stack
                                        direction="row"
                                        justifyContent="flex-end"
                                        gap={{ xs: 0, sm: 0.5 }} 
                                    >
                                        <IconButton
                                            onClick={() => onEdit(row)}
                                            size="small" 
                                            sx={{ padding: { xs: "4px", sm: "8px" } }}
                                        >
                                            <EditIcon sx={{
                                                color: theme[mode].tertiary,
                                                fontSize: { xs: "16px", sm: "18px" } 
                                            }} />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => onDelete(row.idUser)}
                                            size="small"
                                            sx={{ padding: { xs: "4px", sm: "8px" } }}
                                        >
                                            <DeleteIcon sx={{
                                                color: "#F44336",
                                                fontSize: { xs: "16px", sm: "18px" }
                                            }} />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};