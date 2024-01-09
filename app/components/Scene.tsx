import { animated as a, useSpring } from "@react-spring/three";
import {
    Environment,
    OrbitControls,
    OrthographicCamera,
} from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { TextureLoader } from "three";
import Loader from "./Loader";

export default function Scene({ dimensions, canvasRef }) {
    const cameraCenter = [0, 0, 0];
    const ref = useRef();
    const springProps = useSpring({
        scale: [dimensions.width, dimensions.height, dimensions.depth],
    });
    const textures = useLoader(TextureLoader, [
        "/1.jpg",
        "/2.jpg",
        "/3.jpg",
        "/4.jpg",
        "/5.jpg",
        "/6.jpg",
    ]);
    const materials = useMemo(
        () =>
            textures.map(
                (texture) => new THREE.MeshBasicMaterial({ map: texture })
            ),
        [textures]
    );

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
                    <color attach="background" args={["#ffffff"]} />
                    <Environment files="/keyshot.hdr" />
                    <OrbitControls target={cameraCenter} />
                    <Suspense fallback={<Loader />}>
                        <a.mesh scale={springProps.scale}>
                            <boxGeometry args={[1, 1, 1]} />
                            {/* <meshStandardMaterial color="white" /> */}
                            <primitive attach="material" object={materials} />
                        </a.mesh>
                    </Suspense>
                </Canvas>
            </div>
        </div>
    );
}
