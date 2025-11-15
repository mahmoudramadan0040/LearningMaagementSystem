import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90caf9" }, // your requested color
    background: {
      default: "#121212", // your requested background
      paper: "#1d1d1d",
    },
  },

  components: {
    MuiPaper: {
      styleOverrides: { root: { borderRadius: 5 } },
    },
  },
});
