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
    <html lang="en" className="bg-body text-white tracking-wider font-klartext">
      <head>
        <link rel="icon" href="/assets/abyss.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>

      <body className="p-4">
        <GlobalProvider>
          {children}
        </GlobalProvider>
      </body>
    </html>
  );
}
