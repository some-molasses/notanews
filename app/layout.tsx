import "./globals.css";
import { Domine, Trocchi } from "next/font/google";

export const BODY_FONT = Domine({ subsets: ["latin"] });
export const TITLE_FONT = Trocchi({ subsets: ["latin"], weight: "400" });

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
      <body className={BODY_FONT.className}>{children}</body>
    </html>
  );
}
