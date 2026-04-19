import ContactForm from "./ContactForm";
import type { ContactFormProps } from "./types";
import { NETWORK } from "../../constants/network";

interface ContactCanvasProps {
  translations: ContactFormProps["translations"];
  lang?: string;
}

export default function ContactCanvas({ translations, lang = "es" }: ContactCanvasProps) {
  return (
    <div className="contact-layout">
      {/* Form */}
      <div className="contact-form-col">
        <ContactForm
          accessKey="b3bdb4ab-ae30-464e-a0e9-6327c904bbc0"
          className=""
          translations={translations}
          lang={lang}
        />
      </div>

      {/* Info panel */}
      <div className="contact-info-col">
        <div className="contact-info-card">
          <div className="ci-status">
            <span className="ci-status-dot" />
            {lang === "es" ? "Disponible para proyectos" : "Available for projects"}
          </div>

          <div className="ci-entries">
            <div className="ci-entry">
              <span className="ci-entry-label">{lang === "es" ? "Email" : "Email"}</span>
              <a href={`mailto:${NETWORK.EMAIL}`} className="ci-entry-value ci-link">
                {NETWORK.EMAIL}
              </a>
            </div>
            <div className="ci-entry">
              <span className="ci-entry-label">{lang === "es" ? "Ubicación" : "Location"}</span>
              <span className="ci-entry-value">CDMX, México · 19.4326°N</span>
            </div>
            <div className="ci-entry">
              <span className="ci-entry-label">{lang === "es" ? "Respuesta" : "Response"}</span>
              <span className="ci-entry-value">{lang === "es" ? "≤ 24 horas" : "≤ 24 hours"}</span>
            </div>
            <div className="ci-entry">
              <span className="ci-entry-label">GitHub</span>
              <a href={NETWORK.GITHUB} target="_blank" rel="noopener" className="ci-entry-value ci-link">
                Itzli2000 ↗
              </a>
            </div>
            <div className="ci-entry">
              <span className="ci-entry-label">LinkedIn</span>
              <a href={NETWORK.LINKEDIN} target="_blank" rel="noopener" className="ci-entry-value ci-link">
                ariel-itzli-molina ↗
              </a>
            </div>
          </div>

          <div className="ci-note">
            {lang === "es"
              ? "Prefiero comenzar con una llamada corta de 15 minutos para entender el contexto antes de cualquier propuesta."
              : "I prefer starting with a short 15-minute call to understand the context before any proposal."}
          </div>
        </div>
      </div>

      <style>{`
        .contact-layout {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 80px;
          align-items: start;
        }
        .contact-info-card {
          border: 1px solid var(--color-base-300);
          padding: 36px;
          background: var(--color-base-200);
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .ci-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono, monospace);
          font-size: 12px;
          letter-spacing: 0.08em;
          color: var(--color-base-content);
          opacity: 0.8;
        }
        .ci-status-dot {
          width: 7px;
          height: 7px;
          background: #4ade80;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 6px #4ade8088;
        }
        .ci-entries {
          display: flex;
          flex-direction: column;
          gap: 0;
          border-top: 1px solid var(--color-base-300);
        }
        .ci-entry {
          display: grid;
          grid-template-columns: 100px 1fr;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid var(--color-base-300);
          align-items: baseline;
        }
        .ci-entry-label {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-base-content);
          opacity: 0.45;
        }
        .ci-entry-value {
          font-size: 14px;
          color: var(--color-base-content);
          opacity: 0.8;
        }
        .ci-link {
          color: var(--color-accent);
          opacity: 1;
          text-decoration: none;
          transition: opacity 0.15s;
        }
        .ci-link:hover { opacity: 0.75; }
        .ci-note {
          font-size: 14px;
          line-height: 1.65;
          color: var(--color-base-content);
          opacity: 0.5;
          font-style: italic;
        }
        @media (max-width: 900px) {
          .contact-layout {
            grid-template-columns: 1fr;
            gap: 48px;
          }
        }
      `}</style>
    </div>
  );
}
