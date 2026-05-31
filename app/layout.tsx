import type { Metadata } from "next";
import { Aboreto, Figtree } from "next/font/google";
import "./globals.css";
import { RuntimeThemeProvider } from "@/components/runtime-theme-provider";
import { TextFieldCopyActions } from "@/components/text-field-copy-actions";
import { ThemeProvider } from "@/components/theme-provider";

const aboreto = Aboreto({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-aboreto",
  weight: "400",
});

const figtree = Figtree({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "HeartWriteAI",
  description:
    "A local-first romance character, persona, lorebook, image, and chat studio built with Next.js, Tailwind, shadcn/ui, and Tauri.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${aboreto.variable} ${figtree.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <RuntimeThemeProvider />
          <TextFieldCopyActions />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
