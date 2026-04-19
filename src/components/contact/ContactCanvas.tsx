import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import Avatar3D from "./avatar";
import ContactForm from "./ContactForm";
import type { ContactFormProps } from "./types";

const ACCESS_KEY = "b3bdb4ab-ae30-464e-a0e9-6327c904bbc0";

interface ContactCanvasProps {
  translations: ContactFormProps["translations"];
  lang?: string;
}

export default function ContactCanvas({ translations, lang = "es" }: ContactCanvasProps) {
  const [currentAnimation, setCurrentAnimation] = useState<
    "Idle" | "Look" | "Cheer" | "Sad"
  >("Idle");

  return (
    <div className="contact-layout">
      {/* Form */}
      <div className="contact-form-col">
        <ContactForm
          accessKey={ACCESS_KEY}
          currentAnimation={currentAnimation}
          secCurrentAnimation={setCurrentAnimation}
          className=""
          translations={translations}
          lang={lang}
        />
      </div>

      {/* Avatar */}
      <div className="contact-avatar-col">
        <div className="contact-avatar-frame">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            style={{ width: "100%", height: "100%" }}
          >
            <Suspense fallback={null}>
              <Avatar3D currentAnimation={currentAnimation} />
            </Suspense>
          </Canvas>
        </div>
        <p className="contact-avatar-note">
          {translations?.form?.avatarText}
        </p>
      </div>

      <style>{`
        .contact-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
        }
        .contact-form-col {}
        .contact-avatar-col {}
        .contact-avatar-frame {
          width: 100%;
          height: 560px;
          background: var(--color-base-200);
          border: 1px solid var(--color-base-300);
        }
        .contact-avatar-note {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          color: var(--color-base-content);
          opacity: 0.4;
          margin: 12px 0 0;
          letter-spacing: 0.06em;
        }
        @media (max-width: 900px) {
          .contact-layout {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .contact-avatar-col {
            order: -1;
          }
          .contact-avatar-frame {
            height: 360px;
          }
        }
      `}</style>
    </div>
  );
}
