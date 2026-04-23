import type { Metadata } from "next";
import { Caveat, Lora } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { MuiProvider } from "@/components/MuiProvider";
import { Box } from "@mui/material";

const caveatFont = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

const loraFont = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yanti's Kitchen",
  description: "Discover authentic Indonesian recipes, snacks, and traditional cakes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${caveatFont.variable} ${loraFont.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#f4f4f4] dark:bg-[#1a1a1a] font-lora text-stone-900 dark:text-stone-100">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MuiProvider>
            <I18nProvider>
              <Navbar />
              <Box
                component="main"
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: "background.default",
                  borderRadius: "24px",
                  overflow: "hidden",
                  m: { xs: 2, md: 4 },
                  mt: { xs: 12, md: 16 }, // Offset for the fixed navbar
                  boxShadow: 3,
                }}
              >
                {children}
              </Box>
              <Footer />
            </I18nProvider>
          </MuiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
