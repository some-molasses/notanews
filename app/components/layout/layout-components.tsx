import "./layout.scss";

export const Row: React.FC<{
  children: React.ReactNode;
  className?: string;
  id?: string;
}> = ({ children, className, id }) => (
  <div className={`layout-row ${className ?? ""}`} id={id}>
    {children}
  </div>
);

export const Column: React.FC<{
  children: React.ReactNode;
  className?: string;
  id?: string;
}> = ({ children, className, id }) => (
  <div className={`layout-col ${className ?? ""}`} id={id}>
    {children}
  </div>
);
