import "./issue-frame.scss";

export const IssueFrame: React.FC<{
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}> = ({ children, ref }) => {
  return (
    <div className={`issue-frame`} ref={ref}>
      <div className="issue-frame-inner">{children}</div>
    </div>
  );
};
