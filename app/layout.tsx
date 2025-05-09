import "./globals.css";
import { Domine, Trocchi } from "next/font/google";

const bodyFont = Domine({ subsets: ["latin"] });

export const metadata = {
  title: "not a n*ws",
  description: "A newsletter builder for you and all your friends",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-ca">
      <body className={bodyFont.className}>{children}</body>
    </html>
  );
}
