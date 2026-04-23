"use client";

import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { ReactNode } from "react";
import { useTheme } from "next-themes";
import { useEffect, useState, useMemo } from "react";

export function MuiProvider({ children }: { children: ReactNode }) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  const muiTheme = useMemo(() => {
    const currentTheme = theme === "system" ? systemTheme : theme;
    return createTheme({
      palette: {
        mode: currentTheme === "dark" ? "dark" : "light",
      },
      shape: {
        borderRadius: 24, // Global all-rounded corner
      },
      typography: {
        fontFamily: "var(--font-lora), serif",
      },
    });
  }, [theme, systemTheme]);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}
