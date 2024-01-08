import {
    Box,
    Environment,
    OrbitControls,
    OrthographicCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import Loader from "./Loader";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Scene() {
    const cameraCenter = [0, 0, 0];
    const ref = useRef();
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);
    const [width, setWidth] = useState(1);
    const [height, setHeight] = useState(2);
    const [depth, setDepth] = useState(3);

    const exportScene = () => {
        const canvas = document.querySelector("canvas");
        canvas.toBlob((blob) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
                const base64data = reader.result;
                try {
                    const response = await fetch("/api/predictions", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            image: base64data,
                            prompt: "A white paper box, white background, 4k, uhd, mockup, photorealistic, ",
                            scheduler: "K_EULER_ANCESTRAL",
                            num_samples: 4,
                            guidance_scale: 7.5,
                            negative_prompt:
                                "text, anime, cartoon, graphic, text, painting, crayon, graphite, abstract, glitch, deformed, mutated, ugly, disfigured",
                            num_inference_steps: 20,
                            adapter_conditioning_scale: 1,
                            adapter_conditioning_factor: 1,
                        }),
                    });

                    let prediction = await response.json();
                    if (response.status !== 201) {
                        setError(prediction.detail);
                        return;
                    }
                    setPrediction(prediction);

                    while (
                        prediction.status !== "succeeded" &&
                        prediction.status !== "failed"
                    ) {
                        await sleep(1000);
                        const response = await fetch(
                            "/api/predictions/" + prediction.id
                        );
                        prediction = await response.json();
                        if (response.status !== 200) {
                            setError(prediction.detail);
                            return;
                        }
                        console.log({ prediction });
                        setPrediction(prediction);
                    }
                } catch (error) {
                    setError(
                        "An error occurred while sending the image to the API."
                    );
                    console.error(error);
                }
            };
        }, "image/png");
    };

    const handleDimensionChange = (dimensionSetter, event) => {
        dimensionSetter(event.target.value);
    };

    const handleDimensionBlur = (dimensionSetter, event) => {
        const value = parseFloat(event.target.value);
        dimensionSetter(!isNaN(value) ? value.toString() : "0");
    };

    return (
        <div className="flex flex-col w-full">
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
                <Canvas shadows gl={{ preserveDrawingBuffer: true }}>
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
                        <Box args={[width, height, depth]} position={[0, 0, 0]}>
                            <meshStandardMaterial color="white" />
                        </Box>
                    </Suspense>
                </Canvas>
            </div>
            <div className="flex flex-row gap-4">
                <input
                    type="text"
                    value={width}
                    onChange={(e) => handleDimensionChange(setWidth, e)}
                    onBlur={(e) => handleDimensionBlur(setWidth, e)}
                    className="w-16 my-4 py-2 px-4 border border-black box-border bg-white focus:outline-none"
                    placeholder="Width"
                />
                <input
                    type="text"
                    value={height}
                    onChange={(e) => handleDimensionChange(setHeight, e)}
                    onBlur={(e) => handleDimensionBlur(setHeight, e)}
                    className="w-16 my-4 py-2 px-4 border border-black box-border bg-white focus:outline-none"
                    placeholder="Height"
                />
                <input
                    type="text"
                    value={depth}
                    onChange={(e) => handleDimensionChange(setDepth, e)}
                    onBlur={(e) => handleDimensionBlur(setDepth, e)}
                    className="w-16 my-4 py-2 px-4 border border-black box-border bg-white focus:outline-none"
                    placeholder="Depth"
                />
                <button
                    className="w-max m-4 py-2 px-4 border border-black box-border bg-white"
                    onClick={exportScene}
                >
                    RENDER
                </button>
            </div>
        </div>
    );
}
