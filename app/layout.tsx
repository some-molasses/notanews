import "./globals.css";
import { Roboto_Serif } from "next/font/google";

const font = Roboto_Serif({ subsets: ["latin"] });

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
      <body className={font.className}>{children}</body>
    </html>
  );
}
