import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import Avatar3D from "./avatar";
import ContactForm from "./ContactForm";

const ACCESS_KEY = "b3bdb4ab-ae30-464e-a0e9-6327c904bbc0";

interface AvatarCanvasProps {
  className?: string;
  currentAnimation?: "Idle" | "Look" | "Cheer" | "Sad";
}

export default function ContactCanvas({ className = "" }: AvatarCanvasProps) {
  const [currentAnimation, setCurrentAnimation] = useState<
    "Idle" | "Look" | "Cheer" | "Sad"
  >("Idle");

  return (
    <div className={`${className}`}>
      <div className="flex-col w-full">
        {/* Contact Form Section */}
        <div className="flex-1 w-full">
          <div className="text-center lg:text-left mb-8">
            <h1 className="text-5xl font-bold text-primary">¡Hablemos!</h1>
            <p className="py-6 text-xl text-base-content/80">
              Conecta conmigo a través de este formulario.
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
              <div className="badge badge-secondary badge-lg gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Respuesta rápida
              </div>
              <div className="badge badge-accent badge-lg gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Seguro
              </div>
              <div className="badge badge-info badge-lg gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14L17 4"
                  />
                </svg>
                Sin spam
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="stats shadow mb-8 w-full">
            <div className="stat">
              <div className="stat-figure text-primary">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="stat-title">Tiempo de respuesta</div>
              <div className="stat-value text-primary">24h</div>
              <div className="stat-desc">Máximo</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="stat-title">Mensajes</div>
              <div className="stat-value text-secondary">100%</div>
              <div className="stat-desc">Leídos</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-5">
          <div className="flex-1 w-full lg:w-1/2 lg:pr-8">
            {/* Contact Form */}
            <ContactForm
              accessKey={ACCESS_KEY}
              currentAnimation={currentAnimation}
              secCurrentAnimation={setCurrentAnimation}
              className="w-full"
            />
          </div>

          {/* Avatar Canvas Section */}
          <div className="flex-1 w-full lg:w-1/2">
            <div className="card bg-base-100 shadow-2xl h-96 lg:h-[600px]">
              <div className="card-body p-0 overflow-hidden rounded-2xl">
                <div className="flex justify-center h-full relative">
                  <Canvas
                    camera={{ position: [0, 0, 5], fov: 50 }}
                    className="w-full h-full"
                  >
                    <Suspense fallback={null}>
                      <Avatar3D currentAnimation={currentAnimation} />
                    </Suspense>
                  </Canvas>
                </div>
              </div>
              <span className="ml-5 mb-2 text-primary block text-xs">
                * El avatar reaccionará a tus acciones mientras escribes tu
                mensaje.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
