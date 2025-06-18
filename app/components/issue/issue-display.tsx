import "./issue-display.scss";

export const IssueDisplay: React.FC<{
  children: React.ReactNode;
  forceDimensions?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}> = ({ children, forceDimensions, ref }) => {
  return (
    <div
      className={`issue-display ${forceDimensions ? "force-dimensions" : ""}`}
      ref={ref}
    >
      <div className="issue-display-inner">{children}</div>
    </div>
  );
};
