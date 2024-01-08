import { useAspect } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { PlaneGeometry, TextureLoader } from "three";

export default function ImageObject({
    layer,
    index,
    isSelected,
    setCurrentLayer,
}) {
    const texture = useLoader(TextureLoader, layer.url);
    const [imageWidth, imageHeight] = useAspect(
        texture.image.width,
        texture.image.height
    );
    const aspectScale = [
        (imageWidth / 10) * layer.scale,
        (imageHeight / 10) * layer.scale,
        1,
    ];
    const meshRef = useRef();
    const handleSize = 0.05;
    const handleHover = (e, hoverState) => {
        e.stopPropagation();
        document.body.style.cursor = hoverState ? "nwse-resize" : "auto";
    };

    const createHandle = (position) => (
        <group position={position}>
            <mesh
                onPointerOver={(e) => handleHover(e, true)}
                onPointerOut={(e) => handleHover(e, false)}
            >
                <planeGeometry
                    args={[handleSize, handleSize * (imageWidth / imageHeight)]}
                />
                <meshBasicMaterial color="#FFFFFF" />
            </mesh>
            <lineSegments>
                <edgesGeometry
                    args={[
                        new THREE.PlaneGeometry(
                            handleSize,
                            handleSize * (imageWidth / imageHeight)
                        ),
                    ]}
                />
                <lineBasicMaterial color="#0A99FF" />
            </lineSegments>
        </group>
    );

    return (
        <mesh
            ref={meshRef}
            position={layer.position}
            rotation={layer.rotation}
            scale={aspectScale}
            renderOrder={index}
            onClick={(e) => {
                e.stopPropagation();
                isSelected ? setCurrentLayer(null) : setCurrentLayer(index);
            }}
        >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
                map={texture}
                transparent={true}
                depthTest={false}
            />
            {isSelected && (
                <>
                    <lineSegments>
                        <edgesGeometry
                            attach="geometry"
                            args={[new PlaneGeometry(1, 1)]}
                        />
                        <lineBasicMaterial attach="material" color="#0A99FF" />
                    </lineSegments>
                    {createHandle([0.5, 0.5, 0])}
                    {createHandle([-0.5, 0.5, 0])}
                    {createHandle([-0.5, -0.5, 0])}
                    {createHandle([0.5, -0.5, 0])}
                </>
            )}
        </mesh>
    );
}
