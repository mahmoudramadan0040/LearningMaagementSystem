// theme.ts
import { createTheme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

// Keep your original colors object
const baseColors = {
  current: "currentColor",
  transparent: "transparent",
  white: "#FFFFFF",
  black: { DEFAULT: "#1C2434", 2: "#010101" },
  red: { DEFAULT: "#FB5454" },
  body: "#64748B",
  bodydark: "#AEB7C0",
  bodydark1: "#DEE4EE",
  bodydark2: "#8A99AF",
  primary: "#3C50E0",
  secondary: "#80CAEE",
  stroke: "#E2E8F0",
  gray: { DEFAULT: "#EFF4FB", 2: "#F7F9FC", 3: "#FAFAFA" },
  graydark: "#333A48",
  whiten: "#F5F7FD",
  whiter: "#F5F7FD",
  boxdark: "#24303F",
  "boxdark-2": "#1A222C",
  strokedark: "#2E3A47",
  "form-strokedark": "#3d4d60",
  "form-input": "#1d2a39",
  meta: {
    1: "#DC3545",
    2: "#EFF2F7",
    3: "#10B981",
    4: "#313D4A",
    5: "#259AE6",
    6: "#FFBA00",
    7: "#FF6766",
    8: "#F0950C",
    9: "#E5E7EB",
    10: "#0FADCF",
  },
  success: "#219653",
  danger: "#D34053",
  warning: "#FFA70B",
};

// Function to return theme colors based on mode
const getColors = (mode: PaletteMode) => {
  if (mode === "light") return baseColors;

  // Dark mode overrides (matches #24303F theme)
  return {
    ...baseColors,
    white: "#24303F",
    black: { DEFAULT: "#DEE4EE", 2: "#FFFFFF" },
    body: "#8A99AF",
    bodydark1: "#DEE4EE",
    bodydark2: "#8A99AF",
    stroke: "#2E3A47",
    gray: { DEFAULT: "#2E3A47", 2: "#24303F", 3: "#1A222C" },
    graydark: "#8A99AF",
    whiten: "#24303F",
    whiter: "#2E3A47",
    meta: {
      ...baseColors.meta,
      2: "#2E3A47",
      9: "#3A4553",
    },
  };
};

// Create MUI theme
export const getTheme = (mode: PaletteMode) => {
  const colors = getColors(mode);

  return createTheme({
    palette: {
      mode,
      primary: { main: colors.primary },
      secondary: { main: colors.secondary },
      background: {
        default: mode === "light" ? colors.white : colors.boxdark,
        paper: mode === "light" ? colors.whiten : colors["boxdark-2"],
      },
      text: {
        primary: mode === "light" ? colors.black.DEFAULT : colors.bodydark1,
        secondary: mode === "light" ? colors.body : colors.bodydark2,
      },
      error: { main: colors.danger },
      success: { main: colors.success },
      warning: { main: colors.warning },
    },
    typography: { fontFamily: "'Roboto', sans-serif" },
  });
};