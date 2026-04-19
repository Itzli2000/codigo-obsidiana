import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { ContactFormData, ContactFormProps } from "../types";

const useContact = ({ accessKey, translations }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    defaultValues: { name: "", email: "", subject: "", message: "" },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    const formData = new FormData();
    formData.append("access_key", accessKey);
    formData.append("name", data.name.trim());
    formData.append("email", data.email.trim());
    formData.append("email_subject", data.subject.trim());
    formData.append("subject", `${data.name} - Contacto desde Código Obsidiana`);
    formData.append("message", data.message.trim());

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        setIsSubmitted(true);
        reset();
      } else {
        throw new Error(result.message || translations?.errors?.submitError || "Error al enviar el formulario");
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : translations?.errors?.submitError || "Error al enviar el formulario. Por favor, intenta de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setSubmitError(null);
    reset();
  };

  const validationRules = {
    name: {
      required: translations?.validation?.nameRequired || "El nombre es requerido",
      minLength: { value: 2, message: translations?.validation?.nameMinLength || "Mínimo 2 caracteres" },
      validate: (v: string) => v.trim() ? true : (translations?.validation?.nameRequired || "El nombre es requerido"),
    },
    email: {
      required: translations?.validation?.emailRequired || "El email es requerido",
      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: translations?.validation?.emailInvalid || "Email inválido" },
      validate: (v: string) => v.trim() ? true : (translations?.validation?.emailRequired || "El email es requerido"),
    },
    subject: {
      required: translations?.validation?.subjectRequired || "El asunto es requerido",
      minLength: { value: 3, message: translations?.validation?.subjectMinLength || "Mínimo 3 caracteres" },
      validate: (v: string) => v.trim() ? true : (translations?.validation?.subjectRequired || "El asunto es requerido"),
    },
    message: {
      required: translations?.validation?.messageRequired || "El mensaje es requerido",
      minLength: { value: 10, message: translations?.validation?.messageMinLength || "Mínimo 10 caracteres" },
      validate: (v: string) => v.trim() ? true : (translations?.validation?.messageRequired || "El mensaje es requerido"),
    },
  };

  return { isSubmitting, isSubmitted, submitError, validationRules, onSubmit, resetForm, handleSubmit, register, errors };
};

export default useContact;
