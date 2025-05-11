export type ButtonProps = {
  children: React.ReactNode;
  handler: () => void;
  variant?: "default" | "destructive";
};
