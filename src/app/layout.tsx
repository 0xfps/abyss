import type { Metadata } from "next";
import "./globals.css";
import GlobalProvider from "@/providers/global-provider";

export const metadata: Metadata = {
  title: "Abyss - Private Money Transfer on EVM Chains.",
  description: "Private Money Transfer on EVM Chains.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="uppercase bg-body text-white tracking-wider">
      <head>
        <link rel="icon" href="/assets/abyss.svg" />
      </head>

      <body>
        <GlobalProvider>
          {children}
        </GlobalProvider>
      </body>
    </html>
  );
}
