import "./globals.css";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300","400","500","600","700"],
});

export const metadata = {
  title: "Consultor BCT",
  description: "Painel Bem Concreto",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={manrope.className + " bg-bc-light text-bc-dark"}>
        {children}
      </body>
    </html>
  );
}