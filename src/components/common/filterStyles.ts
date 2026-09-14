import { COLORS, RADIUS, TYPOGRAPHY } from "../../theme/designToken";

export const filterFieldSx = {
  "& .MuiOutlinedInput-root": {
    height: 44,
    borderRadius: RADIUS.input,
    backgroundColor: COLORS.white,
    transition: "all 0.2s ease",

    "& fieldset": {
      borderColor: COLORS.border,
    },

    "&:hover fieldset": {
      borderColor: "#C9CBF5",
    },

    "&.Mui-focused": {
      boxShadow: "0 0 0 3px rgba(91, 92, 235, 0.08)",
    },

    "&.Mui-focused fieldset": {
      borderColor: COLORS.primary,
      borderWidth: "1px",
    },
  },

  "& .MuiSelect-select": {
    fontFamily: TYPOGRAPHY.fontFamily,
    fontSize: "12.5px",
    fontWeight: 500,
    color: COLORS.inputText,
    display: "flex",
    alignItems: "center",
  },
};

export const menuItemSx = {
  fontFamily: TYPOGRAPHY.fontFamily,
  fontSize: "12.5px",
  color: COLORS.inputText,

  "&.Mui-selected": {
    backgroundColor: COLORS.primaryLight,
    color: COLORS.primaryDark,
  },

  "&.Mui-selected:hover": {
    backgroundColor: "#E7E8FF",
  },
};