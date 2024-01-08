import { animated as a, useSpring } from "@react-spring/three";
import {
    Environment,
    OrbitControls,
    OrthographicCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import Loader from "./Loader";

export default function Scene({ dimensions, canvasRef }) {
    const cameraCenter = [0, 0, 0];
    const ref = useRef();
    const springProps = useSpring({
        scale: [dimensions.width, dimensions.height, dimensions.depth],
    });

    return (
        <div className="flex flex-col w-full gap-4">
            <div
                ref={ref}
                className="border box-border border-black"
                style={{
                    width: "100%",
                    aspectRatio: 1,
                    maxWidth: "512px",
                    maxHeight: "512px",
                }}
            >
                <Canvas
                    ref={canvasRef}
                    shadows
                    gl={{ preserveDrawingBuffer: true }}
                >
                    <OrthographicCamera
                        makeDefault
                        position={[5, 3, 5]}
                        zoom={70}
                        onUpdate={(self) => self.lookAt(...cameraCenter)}
                    />
                    <color attach="background" args={["white"]} />
                    <Environment files="/keyshot.hdr" />
                    <OrbitControls target={cameraCenter} />
                    <directionalLight
                        castShadow
                        position={[0, 6, 5]}
                        intensity={2}
                        shadow-mapSize-width={1024}
                        shadow-mapSize-height={1024}
                        shadow-bias={-0.0001}
                    />
                    <Suspense fallback={<Loader />}>
                        <a.mesh scale={springProps.scale}>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshStandardMaterial color="white" />
                        </a.mesh>
                    </Suspense>
                </Canvas>
            </div>
        </div>
    );
}
