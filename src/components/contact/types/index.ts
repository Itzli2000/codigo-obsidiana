export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormProps {
  accessKey: string;
  className?: string;
  secCurrentAnimation: (animation: "Idle" | "Look" | "Cheer" | "Sad") => void;
  currentAnimation: "Idle" | "Look" | "Cheer" | "Sad";
}
