import { NETWORK } from "../../constants/network";
import useContact from "./hooks/useContact";
import type { ContactFormProps } from "./types";

const ContactForm = ({
  accessKey,
  className = "",
  translations,
  lang = "es",
}: ContactFormProps & { lang?: string }) => {
  const {
    isSubmitting,
    isSubmitted,
    submitError,
    validationRules,
    onSubmit,
    resetForm,
    handleSubmit,
    register,
    errors,
  } = useContact({ accessKey, translations });

  if (isSubmitted) {
    return (
      <div className={`cf-success ${className}`}>
        <div className="cf-success-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="cf-success-title">{translations.form.success}</h3>
        <p className="cf-success-msg">{translations.form.successMessage}</p>
        <button onClick={resetForm} className="cf-btn-ghost" type="button">
          {translations.form.reset}
        </button>
        <style>{`
          .cf-success { padding: 48px 0; text-align: center; }
          .cf-success-icon {
            width: 56px; height: 56px;
            background: oklch(var(--su) / 0.15);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 20px;
            color: oklch(var(--su));
          }
          .cf-success-title {
            font-family: var(--font-display, serif);
            font-size: 26px;
            font-weight: 500;
            margin: 0 0 10px;
            color: var(--color-base-content);
          }
          .cf-success-msg {
            font-size: 15px;
            opacity: 0.65;
            margin: 0 0 28px;
            color: var(--color-base-content);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`cf-wrap ${className}`}>
      <h2 className="cf-heading">{translations.form.title}</h2>

      {submitError && (
        <div className="cf-error-banner" role="alert">
          <span>
            {translations.errors.submitError}{" "}
            <a href={`mailto:${NETWORK.EMAIL}`}>{NETWORK.EMAIL}</a>
          </span>
          <button onClick={resetForm} className="cf-btn-ghost" type="button">
            {translations.form.reset}
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="cf-form" noValidate>
        {/* Name */}
        <div className="cf-field">
          <label className="cf-label" htmlFor="contact-name">
            {translations.form.name} <span className="cf-required">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            placeholder={translations.form.name}
            className={`cf-input ${errors.name ? "cf-input-error" : ""}`}
            {...register("name", validationRules.name)}

            disabled={isSubmitting}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <span className="cf-field-error" role="alert">{errors.name.message}</span>
          )}
        </div>

        {/* Email */}
        <div className="cf-field">
          <label className="cf-label" htmlFor="contact-email">
            {translations.form.email} <span className="cf-required">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            placeholder={translations.form.emailPlaceholder}
            className={`cf-input ${errors.email ? "cf-input-error" : ""}`}
            {...register("email", validationRules.email)}

            disabled={isSubmitting}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <span className="cf-field-error" role="alert">{errors.email.message}</span>
          )}
        </div>

        {/* Subject */}
        <div className="cf-field">
          <label className="cf-label" htmlFor="contact-subject">
            {translations.form.subject} <span className="cf-required">*</span>
          </label>
          <input
            id="contact-subject"
            type="text"
            placeholder={translations.form.subjectPlaceholder}
            className={`cf-input ${errors.subject ? "cf-input-error" : ""}`}
            {...register("subject", validationRules.subject)}

            disabled={isSubmitting}
            aria-invalid={!!errors.subject}
          />
          {errors.subject && (
            <span className="cf-field-error" role="alert">{errors.subject.message}</span>
          )}
        </div>

        {/* Message */}
        <div className="cf-field">
          <label className="cf-label" htmlFor="contact-message">
            {translations.form.message} <span className="cf-required">*</span>
          </label>
          <textarea
            id="contact-message"
            className={`cf-textarea ${errors.message ? "cf-input-error" : ""}`}
            placeholder={translations.form.messagePlaceholder}
            {...register("message", validationRules.message)}

            disabled={isSubmitting}
            aria-invalid={!!errors.message}
          />
          {errors.message && (
            <span className="cf-field-error" role="alert">{errors.message.message}</span>
          )}
        </div>

        <p className="cf-required-note">{translations.form.required}</p>

        <button type="submit" className="cf-btn-primary" disabled={isSubmitting}>
          {isSubmitting && (
            <span className="cf-spinner" aria-hidden="true" />
          )}
          {isSubmitting ? translations.form.sending : translations.form.send}
        </button>
      </form>

      <style>{`
        .cf-wrap {}
        .cf-heading {
          font-family: var(--font-display, serif);
          font-size: 28px;
          font-weight: 500;
          letter-spacing: -0.01em;
          margin: 0 0 36px;
          color: var(--color-base-content);
        }
        .cf-form { display: flex; flex-direction: column; gap: 20px; }
        .cf-field { display: flex; flex-direction: column; gap: 6px; }
        .cf-label {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-base-content);
          opacity: 0.55;
        }
        .cf-required { color: var(--color-accent); opacity: 1; }
        .cf-input, .cf-textarea {
          width: 100%;
          background: transparent;
          border: 1px solid var(--color-base-300);
          border-radius: 4px;
          padding: 12px 14px;
          font-family: var(--font-body, sans-serif);
          font-size: 15px;
          color: var(--color-base-content);
          transition: border-color 0.15s;
          box-sizing: border-box;
          outline: none;
        }
        .cf-input:focus, .cf-textarea:focus {
          border-color: var(--color-accent);
        }
        .cf-input-error { border-color: var(--color-error) !important; }
        .cf-textarea { height: 120px; resize: vertical; }
        .cf-field-error {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          color: var(--color-error);
          letter-spacing: 0.04em;
        }
        .cf-required-note {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          opacity: 0.35;
          margin: 0;
          color: var(--color-base-content);
        }
        .cf-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 24px;
          background: var(--color-accent);
          color: var(--color-base-100);
          border: 1px solid transparent;
          border-radius: 4px;
          font-family: var(--font-body, sans-serif);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: filter 0.2s, transform 0.2s;
          align-self: flex-start;
        }
        .cf-btn-primary:hover:not(:disabled) {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }
        .cf-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .cf-btn-ghost {
          display: inline-flex;
          align-items: center;
          padding: 10px 18px;
          background: transparent;
          color: var(--color-base-content);
          border: 1px solid var(--color-base-300);
          border-radius: 4px;
          font-family: var(--font-body, sans-serif);
          font-size: 13px;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .cf-btn-ghost:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
        }
        .cf-error-banner {
          background: oklch(var(--er) / 0.1);
          border: 1px solid oklch(var(--er) / 0.3);
          border-radius: 4px;
          padding: 14px 16px;
          font-size: 14px;
          color: var(--color-base-content);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .cf-error-banner a { color: var(--color-accent); }
        .cf-spinner {
          width: 14px; height: 14px;
          border: 2px solid transparent;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: cf-spin 0.6s linear infinite;
          display: inline-block;
        }
        @keyframes cf-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ContactForm;
