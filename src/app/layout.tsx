import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Central do Aluno",
  description: "Portal do aluno — perfil, financeiro e carteirinha digital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
