import { TITLE_FONT } from "@/app/styles";

export const Heading1: React.FC<{
  children: React.ReactNode;
  className: string;
}> = ({ children, className }) => {
  return (
    <h1 className={`${TITLE_FONT.className} ${className ?? ""}`}>{children}</h1>
  );
};

export const Heading2: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <h2 className={`${TITLE_FONT.className}`}>{children}</h2>;
};
