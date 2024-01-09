import { animated as a, useSpring } from "@react-spring/three";
import {
    Environment,
    OrbitControls,
    OrthographicCamera,
    useTexture,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import Loader from "./Loader";

function BoxMesh({ dimensions }) {
    const springProps = useSpring({
        scale: [dimensions.width, dimensions.height, dimensions.depth],
    });
    const textures = useTexture([
        "/pixodoxstudios_Digital_Display_--v_5.2_daa39fd6-4f60-4a9d-b5e2-6867a80d7aa5.png",
        "/1.jpg",
        "/2.jpg",
        "/3.jpg",
        "/4.jpg",
        "/5.jpg",
    ]);
    const materials = useMemo(
        () =>
            textures.map(
                (texture) => new THREE.MeshBasicMaterial({ map: texture })
            ),
        [textures]
    );

    return (
        <a.mesh scale={springProps.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="white" />
            {materials.map((material, index) => (
                // Apply each material to a different side of the box
                <primitive
                    key={index}
                    attach={`material-${index}`}
                    object={material}
                />
            ))}
        </a.mesh>
    );
}
export default function Scene({ dimensions, canvasRef }) {
    const cameraCenter = [0, 0, 0];
    const ref = useRef();
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
                    {/* <color attach="background" args={["#ffffff"]} /> */}
                    <Environment files="/keyshot.hdr" />
                    <OrbitControls target={cameraCenter} />
                    <BoxMesh dimensions={dimensions} />
                    <Suspense fallback={<Loader />}></Suspense>
                </Canvas>
            </div>
        </div>
    );
}
