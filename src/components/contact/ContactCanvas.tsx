import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import Avatar3D from "./avatar";
import ContactForm from "./ContactForm";
import type { ContactFormProps } from "./types";

const ACCESS_KEY = "b3bdb4ab-ae30-464e-a0e9-6327c904bbc0";

interface ContactCanvasProps {
  translations: ContactFormProps["translations"];
}

export default function ContactCanvas({ translations }: ContactCanvasProps) {
  const [currentAnimation, setCurrentAnimation] = useState<
    "Idle" | "Look" | "Cheer" | "Sad"
  >("Idle");

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-5">
      <div className="flex-1 w-full lg:w-1/2 lg:pr-8">
        {/* Contact Form */}
        <ContactForm
          accessKey={ACCESS_KEY}
          currentAnimation={currentAnimation}
          secCurrentAnimation={setCurrentAnimation}
          className="w-full"
          translations={translations}
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
            {translations?.form?.avatarText || "* El avatar reaccionará a tus acciones mientras escribes tu mensaje."}
          </span>
        </div>
      </div>
    </div>
  );
}
