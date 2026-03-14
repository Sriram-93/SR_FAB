import { Component, Suspense, useEffect, useMemo, useRef, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  ContactShadows,
  Center,
} from "@react-three/drei";
import { Color } from "three";

// Set decoder path for Draco compressed models
useGLTF.setDecoderPath("/draco/gltf/");

const PlaceholderBox = () => {
  const meshRef = useRef(null);
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#8833ff" />
    </mesh>
  );
};

// Stable Model renderer that avoids redundant work
const ModelMesh = memo(({ url, activeColor }) => {
  const { scene } = useGLTF(url);
  
  // Memoize the color to avoid overhead
  const finalColorHex = useMemo(() => {
    const key = String(activeColor || "").trim().toLowerCase();
    const colorMap = {
      black: "#1A1A1A",
      white: "#FFFFFF",
      navy: "#000080",
      "navy blue": "#000080",
      beige: "#F5F5DC",
      grey: "#808080",
      blue: "#3b82f6",
    };
    return colorMap[key] || activeColor || "#ffffff";
  }, [activeColor]);

  useEffect(() => {
    if (!scene) return;
    const colorObj = new Color(finalColorHex);
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        if (child.material.color) {
            child.material.color.set(colorObj);
        }
        child.material.needsUpdate = true;
      }
    });
  }, [scene, finalColorHex]);

  return <primitive object={scene} />;
});

ModelMesh.displayName = "ModelMesh";

class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

const ModelViewer = ({ modelUrl, activeColor }) => {
  const hasModel = Boolean(modelUrl);

  return (
    <div className="relative h-full w-full bg-[var(--elevated)] overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 40 }}
        dpr={0.75} // Reduced DPR for stability on high-poly models
        gl={{ 
            antialias: false, 
            powerPreference: "default",
            alpha: true,
            stencil: false,
            depth: true 
        }}
        flat={true} 
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 10]} intensity={2.5} castShadow={false} />
        {hasModel && <Environment preset="studio" blur={1} />}

        <Suspense fallback={null}>
          <Center>
            {hasModel ? (
              <ModelErrorBoundary fallback={<PlaceholderBox />}>
                <ModelMesh url={modelUrl} activeColor={activeColor} />
              </ModelErrorBoundary>
            ) : (
              <PlaceholderBox />
            )}
          </Center>
        </Suspense>

        <OrbitControls
          autoRotate={hasModel}
          autoRotateSpeed={0.5}
          enableZoom={true}
          enablePan={false}
          makeDefault
        />
        
        {hasModel && (
          <ContactShadows
            resolution={128} // Significantly lower shadow map to prevent Context Loss
            scale={15}
            blur={2.5}
            opacity={0.2}
            far={1}
          />
        )}
      </Canvas>

      {/* Loader UI outside Canvas for lower GPU overhead */}
      <Suspense fallback={
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--elevated)] bg-opacity-50">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
          <span className="mt-4 animate-pulse text-[10px] font-bold uppercase tracking-widest text-muted/40 text-center">
            Optimizing Performance
          </span>
        </div>
      }>
        <div className="hidden" />
      </Suspense>
    </div>
  );
};

export default memo(ModelViewer);
