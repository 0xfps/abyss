import type { Metadata } from "next";
import "./globals.css";

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
      <body>
        {children}
      </body>
    </html>
  );
}
