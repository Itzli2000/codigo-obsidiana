import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useGraph } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import { Object3D, Group } from "three";
import { SkeletonUtils } from "three-stdlib";

interface Avatar3DProps {
  autoRotate?: boolean;
  [key: string]: any;
}

interface GLTFResult {
  nodes: Record<string, any>;
  materials: Record<string, any>;
}

export function AvatarModel(props: any) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF("/assets/model/avatar.glb") as unknown as {
    scene: Object3D;
  };
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone) as GLTFResult;

  const { animations: greetingAnimation } = useFBX("/assets/model/greeting.fbx");
  greetingAnimation[0].name = "Greeting";
  const { actions } = useAnimations(greetingAnimation, groupRef);
  console.log(actions);

  useEffect(() => {
    if (actions["Greeting"]) {
      actions["Greeting"].play();
    }
  }, [actions]);

  return (
    <group {...props} ref={groupRef} dispose={null}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
    </group>
  );
}

export default function Avatar3D() {
  return (
    <>
      <AvatarModel position={[0, -1.65, 0.95]} rotation={[Math.PI/-2, 0, 0]} />

      <ambientLight intensity={1.2} />

      <directionalLight position={[0, 1, 2]} intensity={2} castShadow />

      <pointLight position={[0, 0, 4]} intensity={1.5} color="#ffffff" />

      <pointLight position={[-2, 0, 1]} intensity={0.7} color="#f8f9fa" />
      <pointLight position={[2, 0, 1]} intensity={0.7} color="#f8f9fa" />

      <pointLight position={[0, 3, 0]} intensity={0.8} color="#ffffff" />
    </>
  );
}
