import "./layout.scss";

type LayoutProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export const Row: React.FC<LayoutProps> = ({ children, className, id }) => (
  <div className={`layout-row ${className ?? ""}`} id={id}>
    {children}
  </div>
);

export const RowReverse: React.FC<LayoutProps> = ({
  children,
  className,
  id,
}) => (
  <div className={`layout-row row-reverse ${className ?? ""}`} id={id}>
    {children}
  </div>
);

export const Column: React.FC<LayoutProps> = ({ children, className, id }) => (
  <div className={`layout-col ${className ?? ""}`} id={id}>
    {children}
  </div>
);
