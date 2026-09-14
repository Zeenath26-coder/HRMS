export const authTextFieldSx = {
  "& .MuiOutlinedInput-root": {
    height: "54px",
    borderRadius: "14px",
    background: "#FFFFFF",
    transition: "all 0.2s ease",

    "& fieldset": {
      borderColor: "#E2E8F0",
    },

    "&:hover fieldset": {
      borderColor: "#A5B4FC",
    },

    "&.Mui-focused": {
      background: "#FFFFFF",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#6366F1",
    },
  },

  "& .MuiInputLabel-root": {
    fontSize: "13px",
    color: "#334155",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#4F46E5",
  },

  "& .MuiFormLabel-asterisk": {
    color: "#DC2626",
  },

  "& .MuiFormHelperText-root": {
    marginLeft: "2px",
    marginTop: "6px",
    fontSize: "11px",
  },

  "& input": {
    fontSize: "14px",
    color: "#1E293B",

    "&::placeholder": {
      color: "#94A3B8",
      opacity: 1,
    },
  },
};

export const authPrimaryButtonSx = {
  height: "56px",
  borderRadius: "15px",
  textTransform: "none",
  fontSize: "14px",
  fontWeight: 650,
  color: "#FFFFFF",
  background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
  boxShadow: "0 12px 28px rgba(79,70,229,0.28)",
  transition: "all 0.2s ease",
  "&:hover": {
    background: "linear-gradient(135deg, #5B5EEB 0%, #4338CA 100%)",
    transform: "translateY(-1px)",
    boxShadow: "0 16px 32px rgba(79,70,229,0.32)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
  "&.Mui-disabled": {
    color: "#FFFFFF",
    background: "#A5B4FC",
  },
};