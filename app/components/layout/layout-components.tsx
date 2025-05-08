import "./layout.scss";

export const Row: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={`layout-row ${className ?? ""}`}>{children}</div>
);

export const Column: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="layout-col">{children}</div>;
