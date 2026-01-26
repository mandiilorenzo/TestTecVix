import { FormControl, SxProps, TextField, InputAdornment, Typography } from "@mui/material";
import { PencilCicleIcon } from "../../icons/PencilCicleIcon";
import { useZTheme } from "../../stores/useZTheme";

export interface IPropsLabelInput {
  label?: string;
  placeholder?: string;
  containerSx?: SxProps;
  type?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  showEditIcon?: boolean;
  sx?: SxProps;
}

export const InputLabel = ({
  label = "",
  placeholder = "",
  type = "text",
  onChange = () => { },
  value = "",
  containerSx = {},
  disabled = false,
  error = "",
  showEditIcon = false,
  sx = {},
}: IPropsLabelInput) => {
  const { theme, mode } = useZTheme();

  return (
    <FormControl sx={{ width: "100%", ...containerSx }}>
      {label && (
        <Typography sx={{ color: theme[mode].primary, mb: 0.5, fontSize: "14px" }}>
          {label}
        </Typography>
      )}
      <TextField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        error={!!error}
        helperText={error}
        InputProps={{
          endAdornment: showEditIcon ? (
            <InputAdornment position="end">
              <PencilCicleIcon
                fill={theme[mode].blueMedium}
                style={{ cursor: 'pointer', width: '20px' }}
              />
            </InputAdornment>
          ) : undefined,
        }}
        sx={{
          width: "100%",
          backgroundColor: theme[mode].mainBackground,
          borderRadius: "8px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": { border: "none" },
            "& .MuiInputBase-input::placeholder": {
              color: theme[mode].tertiary,
              opacity: 1,
            },
            "&.Mui-focused fieldset": {
              border: "1px solid",
              borderColor: theme[mode].blue
            },
          },
          "& .MuiInputBase-input": { padding: "10px 14px" },
          "& .MuiFormHelperText-root": {
            color: theme[mode].danger,
            fontSize: "12px",
            margin: "4px 2px",
          },
          ...sx,
        }}
      />
    </FormControl>
  );
};