export type ButtonProps = {
  children: React.ReactNode;
  handler: (formData: FormData) => void;
  variant?: "default" | "destructive";
};
