import { TITLE_FONT } from "@/app/layout";

export const Heading2: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <h2 className={`${TITLE_FONT.className}`}>{children}</h2>;
};
