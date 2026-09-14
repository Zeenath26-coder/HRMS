export const formFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#FFFFFF",

    "& fieldset": {
      borderColor: "#E4E6EC",
    },

    "&:hover fieldset": {
      borderColor: "#C8CCDA",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#5965E8",
      borderWidth: "1px",
    },
  },

  "& .MuiInputLabel-root": {
    fontFamily: "Poppins, sans-serif",
    fontSize: "12px",
    color: "#687083",
  },

  "& .MuiInputBase-input": {
    fontFamily: "Poppins, sans-serif",
    fontSize: "12px",
    color: "#292D38",
  },

  "& .MuiFormHelperText-root": {
    fontFamily: "Poppins, sans-serif",
    fontSize: "10px",
    marginLeft: "2px",
  },
  "& .MuiFormLabel-asterisk": {
    color: "#DC2626",
  },
};

export const secondaryButtonSx = {
  height: 40,
  px: 1.8,
  borderRadius: "11px",
  textTransform: "none",
  fontFamily: "Poppins, sans-serif",
  fontSize: 11.5,
  fontWeight: 600,
  color: "#646978",
  border: "1px solid #E2E4EA",
  backgroundColor: "#FFFFFF",

  "&:hover": {
    backgroundColor: "#F8F8FA",
    borderColor: "#D6D8E0",
  },
};

export const primaryButtonSx = {
  height: 40,
  px: 2,
  borderRadius: "11px",
  textTransform: "none",
  fontFamily: "Poppins, sans-serif",
  fontSize: 11.5,
  fontWeight: 600,
  color: "#FFFFFF",
  background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
  boxShadow: "0 7px 18px rgba(79,70,229,0.20)",
  "&:hover": {
    background: "linear-gradient(135deg, #5B5EEB 0%, #4338CA 100%)",
  },

  "&.Mui-disabled": {
    color: "#FFFFFF",
    background: "#A5B4FC",
  },
};
