import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Salesianos Cooperadores - Panel Administrativo",
  description: "Panel de administración de la app Salesianos Cooperadores",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
