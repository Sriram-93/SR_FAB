import { Component, Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  ContactShadows,
  Center,
  Html,
} from "@react-three/drei";
import { Color } from "three";

// This is a placeholder spinning box. Once you generate a .glb model,
// you can replace this with your actual product model!
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

// Actual Model component using useGLTF.
const normalizeColor = (activeColor) => {
  if (!activeColor) return null;

  const key = String(activeColor).trim().toLowerCase();
  const colorMap = {
    black: "#1A1A1A",
    white: "#FFFFFF",
    navy: "#000080",
    "navy blue": "#000080",
    beige: "#F5F5DC",
    grey: "#808080",
    gray: "#808080",
    maroon: "#800000",
    blue: "#3b82f6",
    sky: "#0ea5e9",
    "sky blue": "#0ea5e9",
    pink: "#ec4899",
    green: "#10b981",
    olive: "#4d7c0f",
    purple: "#8b5cf6",
    charcoal: "#374151",
    cream: "#f5f5dc",
    mustard: "#ca8a04",
    yellow: "#facc15",
  };

  return colorMap[key] || activeColor;
};

const Model = ({ url, activeColor }) => {
  const { scene } = useGLTF(url);
  const finalColor = useMemo(() => normalizeColor(activeColor), [activeColor]);

  useEffect(() => {
    if (!scene || !finalColor) return;

    let parsed;
    try {
      parsed = new Color(finalColor);
    } catch {
      // Ignore unsupported color formats instead of crashing the modal.
      return;
    }

    scene.traverse((child) => {
      if (!child.isMesh || !child.material || !child.material.color) return;
      child.material.color.copy(parsed);
      child.material.needsUpdate = true;
    });
  }, [scene, finalColor]);

  return <primitive object={scene} />;
};

class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Intentionally swallow model loading/render errors and show placeholder.
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const ModelViewer = ({ modelUrl, activeColor }) => {
  const hasModel = Boolean(modelUrl);

  return (
    <Canvas
      camera={{ position: [0, 0, 3.2], fov: 40 }}
      className="h-full w-full bg-[var(--elevated)]"
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={2} />
      <directionalLight position={[10, 10, 10]} intensity={3} castShadow />
      <directionalLight position={[-10, 0, -10]} intensity={1.5} />
      {hasModel && <Environment preset="studio" />}

      <Suspense
        fallback={
          <Html center>
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
              <span className="animate-pulse text-[10px] font-bold uppercase tracking-widest text-muted/40">
                Initializing Studio
              </span>
            </div>
          </Html>
        }
      >
        <Center>
          {hasModel ? (
            <ModelErrorBoundary fallback={<PlaceholderBox />}>
              <Model url={modelUrl} activeColor={activeColor} />
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
        minDistance={0.5}
        maxDistance={8}
        enablePan={false}
        makeDefault
      />
      {hasModel && (
        <ContactShadows
          resolution={512}
          scale={15}
          blur={2.2}
          opacity={0.28}
          far={1}
        />
      )}
    </Canvas>
  );
};

// If you want to pre-load a default model, uncomment this:
// useGLTF.preload('/my_cool_product.glb');

export default ModelViewer;
