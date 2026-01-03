import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./provider"; 

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sync Shot",
  description: "Intern Assignment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={``}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}