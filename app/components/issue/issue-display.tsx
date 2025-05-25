import "./issue-display.scss";

export const IssueDisplay: React.FC<{
  children: React.ReactNode;
  forceDimensions: boolean;
}> = ({ children, forceDimensions }) => {
  return (
    <div
      className={`issue-display ${forceDimensions ? "force-dimensions" : ""}`}
    >
      <div className="issue-display-inner">{children}</div>
    </div>
  );
};
