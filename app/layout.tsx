import "./globals.css";
import { BODY_FONT } from "./styles";

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
