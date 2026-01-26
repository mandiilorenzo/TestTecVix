import { Stack, Typography, Box, Button, TextField, CircularProgress } from "@mui/material";
import { useZTheme } from "../../../../stores/useZTheme";
import { useZUserProfile } from "../../../../stores/useZUserProfile";
import { useState, useRef } from "react";
import { UploadIcon } from "../../../../icons/UploadIcon";
import { toast } from "react-toastify";
import { BrandMasterService } from "../../../../services/BrandMasterService";

export const WhiteLabel = () => {
  const { theme, mode } = useZTheme();
  const { role, idBrand } = useZUserProfile();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [domain, setDomain] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canEdit = role === "admin" || role === "manager";

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const rawBase64 = result.split(',')[1]; 
        setLogoUrl(rawBase64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!idBrand) {
      toast.error("ID da empresa não encontrado.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        domain: domain.trim() || undefined,
        brandLogo: logoUrl || undefined
      };

      const response = await BrandMasterService.updateWhiteLabel(idBrand, payload);

      if (response.error) {
        toast.error(response.message || "Erro ao atualizar White Label");
      } else {
        toast.success("Configurações atualizadas com sucesso!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro técnico ao salvar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canEdit) {
    return (
      <Stack sx={{ p: 4, alignItems: "center" }}>
        <Typography sx={{ color: theme[mode].tertiary }}>
          Você não tem permissão para acessar estas configurações.
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack width={"100%"} sx={{ gap: "32px", boxSizing: "border-box", maxWidth: "800px" }}>
      <Box>
        <Typography sx={{ color: theme[mode].black, fontSize: "16px", fontWeight: 600, mb: 2 }}>
          Logo da marca
        </Typography>
        <Box sx={{
          backgroundColor: "#20232B",
          p: 4,
          borderRadius: "16px",
          border: `1px dashed ${theme[mode].tertiary}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2
        }}>
          <Box onClick={() => fileInputRef.current?.click()} sx={{ cursor: "pointer", textAlign: "center" }}>
            {logoUrl ?
              <img src={logoUrl} alt="Logo Preview" style={{ maxHeight: "80px", maxWidth: "100%", objectFit: "contain" }} />
              :
              <Stack alignItems="center" gap={1}>
                <UploadIcon />
                <Typography sx={{ color: "#FFF", fontSize: "12px" }}>Clique aqui para fazer upload do seu logo</Typography>
              </Stack>
            }
          </Box>

          <input type="file" hidden ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" />

          <Stack direction="row" gap={2}>
            <Button
              onClick={() => fileInputRef.current?.click()}
              sx={{ backgroundColor: theme[mode].blue, color: "#FFF", borderRadius: "8px", textTransform: "none", px: 3, "&:hover": { backgroundColor: theme[mode].blueDark } }}
            >
              Alterar logo
            </Button>
            {logoUrl && (
              <Button
                onClick={() => setLogoUrl("")}
                sx={{ border: "1px solid #FFF", color: "#FFF", borderRadius: "8px", textTransform: "none", px: 3 }}
              >
                Remover logo
              </Button>
            )}
          </Stack>

          <Stack alignItems="flex-start" width="100%" sx={{ mt: 2 }}>
            <Typography sx={{ color: theme[mode].tertiary, fontSize: "12px" }}>• Padrão: 165x50px</Typography>
            <Typography sx={{ color: theme[mode].tertiary, fontSize: "12px" }}>• Tamanho Máx: 5MB</Typography>
            <Typography sx={{ color: theme[mode].tertiary, fontSize: "12px" }}>• Formatos: .svg .png .jpg .gif .webp</Typography>
          </Stack>
        </Box>
      </Box>

      <Box>
        <Typography sx={{ color: theme[mode].black, fontSize: "16px", fontWeight: 600, mb: 1 }}>
          DNS (Domain/Subdomain)
        </Typography>
        <TextField
          fullWidth
          placeholder="ex: cliente.vitux.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": { backgroundColor: "#2C313C", borderRadius: "12px", color: "#FFF" }, // Ajuste cores conforme seu tema
            "& .MuiInputBase-input": { color: "#FFF" }
          }}
        />
      </Box>

      <Button
        onClick={handleSave}
        disabled={isSubmitting}
        fullWidth
        sx={{
          backgroundColor: theme[mode].blue,
          color: "#FFF",
          borderRadius: "12px",
          height: "48px",
          fontWeight: 600,
          "&:hover": { backgroundColor: theme[mode].blueDark }
        }}
      >
        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Salvar alterações"}
      </Button>

    </Stack>
  );
};