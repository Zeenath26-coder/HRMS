export const COLORS = {
  primary: "#5B5CEB",
  primaryDark: "#4F46E5",
  primaryLight: "#EEF0FF",

  text: "#20234A",
  textSecondary: "#7A7F9A",

  border: "#E5E7F2",
  borderLight: "#ECEEF3",

  background: "#F8F9FF",
  white: "#FFFFFF",

  inputText: "#444866",
  mutedText: "#969AA6",

  danger: "#DC4C64",
  dangerDark: "#DC2626",

  success: "#047857",
  warning: "#C2410C",
} as const;

export const RADIUS = {
  input: "12px",
  button: "12px",
  card: "16px",
  dialog: "20px",
  menu: "14px",
  small: "9px",
  pill: "999px",
} as const;

export const SHADOWS = {
  card: "0 4px 18px rgba(48, 52, 110, 0.035)",
  button: "0 6px 16px rgba(91, 92, 235, 0.18)",
  buttonHover: "0 8px 20px rgba(91, 92, 235, 0.24)",
  dialog: "0 24px 70px rgba(42, 45, 100, 0.18)",
  menu: "0 10px 35px rgba(30, 41, 59, 0.10)",
} as const;

export const TYPOGRAPHY = {
  fontFamily: "Poppins, sans-serif",
} as const;