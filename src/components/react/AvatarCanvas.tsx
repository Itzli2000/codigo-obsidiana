import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Avatar3D from './Avatar3D';

interface AvatarCanvasProps {
  className?: string;
}

export default function AvatarCanvas({ className = '' }: AvatarCanvasProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 2], fov: 50 }}
        style={{ 
          width: '100%', 
          height: '100%',
          borderRadius: '100%',
        }}
      >
        <Suspense fallback={null}>
          <Avatar3D />
        </Suspense>
      </Canvas>
    </div>
  );
} 