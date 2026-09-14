import {
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";

import {
  Cancel01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";
import { COLORS, RADIUS, TYPOGRAPHY } from "../../theme/designToken";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchField = ({
  value,
  onChange,
  placeholder = "Search...",
}: SearchFieldProps) => {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete="off"
      sx={{
        width: {
          xs: "100%",
          sm: 360,
          md: 430,
        },

        "& .MuiOutlinedInput-root": {
          height: 44,
          borderRadius: RADIUS.input,
          backgroundColor: COLORS.white,
          transition: "all 0.2s ease",

          "& fieldset": {
            borderColor: COLORS.border,
          },

          "&:hover": {
            boxShadow: "0 3px 12px rgba(70, 75, 150, 0.04)",
          },

          "&:hover fieldset": {
            borderColor: "#D5D7F6",
          },

          "&.Mui-focused": {
            boxShadow: "0 0 0 3px rgba(91, 92, 235, 0.08)",
          },

          "&.Mui-focused fieldset": {
            borderColor: COLORS.primary,
          },
        },

        "& .MuiInputBase-input": {
          fontFamily: TYPOGRAPHY.fontFamily,
          fontSize: 12.5,
          color: COLORS.text,

          "&::placeholder": {
            color: "#9BA0B5",
            opacity: 1,
          },
        },
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <HugeiconsIcon
                icon={Search01Icon}
                size={18}
                color="#8B91AD"
              />
            </InputAdornment>
          ),

          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => onChange("")}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "8px",
                  color: "#8B91AD",

                  "&:hover": {
                    backgroundColor: COLORS.primaryLight,
                    color: COLORS.primary,
                  },
                }}
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  );
};

export default SearchField;