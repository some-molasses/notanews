export type ButtonProps = {
  children: React.ReactNode;
  handler: ((formData: FormData) => void) | (() => void);
  variant?: "default" | "destructive";
};
