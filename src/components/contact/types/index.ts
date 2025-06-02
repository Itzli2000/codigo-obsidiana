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
  translations: {
    form: {
      title: string;
      name: string;
      email: string;
      emailPlaceholder: string;
      subjectPlaceholder: string;
      subject: string;
      message: string;
      messagePlaceholder: string;
      send: string;
      sending: string;
      success: string;
      successMessage: string;
      reset: string;
      required: string;
      avatarText: string;
    };
    validation: {
      nameRequired: string;
      nameMinLength: string;
      emailRequired: string;
      emailInvalid: string;
      subjectRequired: string;
      subjectMinLength: string;
      messageRequired: string;
      messageMinLength: string;
    };
    errors: {
      submitError: string;
      contactEmail: string;
    };
  };
}
