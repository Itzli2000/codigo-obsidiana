import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { ContactFormData, ContactFormProps } from "../types";

const useContact = ({ accessKey, secCurrentAnimation, currentAnimation }: ContactFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
  
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<ContactFormData>({
      defaultValues: {
        name: "",
        email: "",
        subject: "",
        message: "",
      },
      mode: "onChange",
    });
  
    const handleChange = () => {
      if (currentAnimation !== "Look") {
        secCurrentAnimation("Look");
      }
    };
  
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
          secCurrentAnimation("Cheer");
        } else {
          secCurrentAnimation("Sad");
          throw new Error(result.message || "Error al enviar el formulario");
        }
      } catch (error) {
        console.error("Form submission error:", error);
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Error al enviar el formulario. Por favor, intenta de nuevo."
        );
      } finally {
        setIsSubmitting(false);
      }
    };
  
    const resetForm = () => {
      secCurrentAnimation("Idle");
      setIsSubmitted(false);
      setSubmitError(null);
      reset();
    };
  
    const validationRules = {
      name: {
        required: "El nombre es requerido",
        minLength: {
          value: 2,
          message: "El nombre debe tener al menos 2 caracteres",
        },
        validate: (value: string) => {
          if (!value.trim()) {
            return "El nombre es requerido";
          }
          return true;
        },
      },
      email: {
        required: "El email es requerido",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Por favor ingresa un email válido",
        },
        validate: (value: string) => {
          if (!value.trim()) {
            return "El email es requerido";
          }
          return true;
        },
      },
      subject: {
        required: "El asunto es requerido",
        minLength: {
          value: 3,
          message: "El asunto debe tener al menos 3 caracteres",
        },
        validate: (value: string) => {
          if (!value.trim()) {
            return "El asunto es requerido";
          }
          return true;
        },
      },
      message: {
        required: "El mensaje es requerido",
        minLength: {
          value: 10,
          message: "El mensaje debe tener al menos 10 caracteres",
        },
        validate: (value: string) => {
          if (!value.trim()) {
            return "El mensaje es requerido";
          }
          return true;
        },
      },
    };

  return {
    isSubmitting,
    isSubmitted,
    submitError,
    validationRules,
    onSubmit,
    resetForm,
    handleChange,
    handleSubmit,
    register,
    errors,
  }
}

export default useContact
