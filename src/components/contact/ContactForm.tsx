import { NETWORK } from "../../constants/network";
import useContact from "./hooks/useContact";
import type { ContactFormProps } from "./types";

const ContactForm = ({
  accessKey,
  secCurrentAnimation,
  currentAnimation,
  className = "",
}: ContactFormProps) => {

    const {
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
      } = useContact({ accessKey, secCurrentAnimation, currentAnimation });

  const resetButton = () => (
    <button
      onClick={resetForm}
      className={`btn btn-outline btn-sm mb-3 ${
        isSubmitted ? "btn-success" : "btn-error"
      }`}
      type="button"
    >
      Reiniciar formulario
    </button>
  );

  if (isSubmitted) {
    return (
      <div className={`card bg-base-100 shadow-xl ${className}`}>
        <div className="card-body text-center">
          <div className="mx-auto w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-success"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-success mb-2">
            ¡Mensaje enviado!
          </h3>
          <p className="text-base-content/70 mb-6">
            Tu mensaje ha sido enviado exitosamente. Te contactaré pronto.
          </p>
          {resetButton()}
        </div>
      </div>
    );
  }

  return (
    <div className={`card bg-base-100 shadow-xl ${className}`}>
      <div className="card-body">
        <h3 className="card-title text-2xl mb-6">Contacto</h3>

        {submitError && (
          <div className="flex flex-col items-end justify-start">
            <div className="alert alert-error mb-3" role="alert">
              <svg
                className="stroke-current shrink-0 w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Ocurrió un error al enviar el mensaje, por favor intenta de
                nuevo o contacta a{" "}
                <a href={`mailto:${NETWORK.EMAIL}`} className="link">
                  {NETWORK.EMAIL}
                </a>
              </span>
            </div>
            {resetButton()}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          {/* Name Field */}
          <div className="form-control">
            <label className="floating-label" htmlFor="contact-name">
              <span>
                Nombre <span className="text-error">*</span>
              </span>
              <input
                id="contact-name"
                type="text"
                placeholder="Tu nombre completo"
                className={`input w-full ${errors.name ? "input-error" : ""}`}
                {...register("name", validationRules.name)}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-describedby={errors.name ? "name-error" : undefined}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <div className="label ml-2 mt-1">
                  <span
                    id="name-error"
                    className="label-text-alt text-error"
                    role="alert"
                  >
                    {errors.name.message}
                  </span>
                </div>
              )}
            </label>
          </div>

          {/* Email Field */}
          <div className="form-control">
            <label className="floating-label" htmlFor="contact-email">
              <span>
                Email <span className="text-error">*</span>
              </span>
              <input
                id="contact-email"
                type="email"
                placeholder="tu@email.com"
                className={`input w-full ${errors.email ? "input-error" : ""}`}
                {...register("email", validationRules.email)}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-describedby={errors.email ? "email-error" : undefined}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <div className="label ml-2 mt-1">
                  <span
                    id="email-error"
                    className="label-text-alt text-error"
                    role="alert"
                  >
                    {errors.email.message}
                  </span>
                </div>
              )}
            </label>
          </div>

          {/* Subject Field */}
          <div className="form-control">
            <label className="floating-label" htmlFor="contact-subject">
              <span>
                Asunto <span className="text-error">*</span>
              </span>
              <input
                id="contact-subject"
                type="text"
                placeholder="¿De qué quieres hablar?"
                className={`input w-full ${
                  errors.subject ? "input-error" : ""
                }`}
                {...register("subject", validationRules.subject)}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-describedby={errors.subject ? "subject-error" : undefined}
                aria-invalid={!!errors.subject}
              />
              {errors.subject && (
                <div className="label ml-2 mt-1">
                  <span
                    id="subject-error"
                    className="label-text-alt text-error"
                    role="alert"
                  >
                    {errors.subject.message}
                  </span>
                </div>
              )}
            </label>
          </div>

          {/* Message Field */}
          <div className="form-control">
            <label className="floating-label" htmlFor="contact-message">
              <span>
                Mensaje <span className="text-error">*</span>
              </span>
              <textarea
                id="contact-message"
                className={`textarea w-full h-32 resize-y ${
                  errors.message ? "textarea-error" : ""
                }`}
                placeholder="Escribe tu mensaje aquí..."
                {...register("message", validationRules.message)}
                onFocus={handleChange}
                disabled={isSubmitting}
                aria-describedby={errors.message ? "message-error" : undefined}
                aria-invalid={!!errors.message}
              />
              {errors.message && (
                <div className="label ml-2 mt-1">
                  <span
                    id="message-error"
                    className="label-text-alt text-error"
                    role="alert"
                  >
                    {errors.message.message}
                  </span>
                </div>
              )}
            </label>
          </div>

          <div
            role="alert"
            className={`alert alert-soft ${
              Object.keys(errors).length > 0 ? "alert-error" : "alert-info"
            }`}
          >
            <span>Todos los campos son obligatorios</span>
          </div>

          {/* Submit Button */}
          <div className="form-control mt-8">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              aria-describedby="submit-description"
            >
              {isSubmitting && (
                <span
                  className="loading loading-spinner loading-sm"
                  aria-hidden="true"
                />
              )}
              {isSubmitting ? "Enviando..." : "Enviar mensaje"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
