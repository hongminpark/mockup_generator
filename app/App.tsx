"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import Loader from "./components/Loader";

const DynamicScene = dynamic(() => import("./components/Scene"), {
    ssr: false,
    loading: Loader,
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function App() {
    const [dimensions, setDimensions] = useState({
        width: 1,
        height: 2,
        depth: 3,
    });
    const canvasRef = useRef();
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);

    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.style.display = "none";
            link.href = url;
            link.download = "scene.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }, "image/png");
    };

    const exportScene = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
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
                            prompt: "A white paper box, white background, 4k, uhd, mockup design, photorealistic, 3d render, minimal",
                            model_type: "depth",
                            num_samples: "4",
                            n_prompt:
                                "text, sticker, image, longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
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

    const handleDimensionChange = (dimension) => (e) => {
        setDimensions({ ...dimensions, [dimension]: e.target.value });
    };

    const handleDimensionBlur = (dimension) => (e) => {
        const value = parseFloat(e.target.value);
        setDimensions({
            ...dimensions,
            [dimension]: !isNaN(value) ? value.toString() : "0",
        });
    };

    const renderDimensionInput = (dimension) => (
        <div className="flex items-center">
            <label className="mr-2 w-16">{dimension}</label>
            <input
                type="text"
                value={dimensions[dimension]}
                onChange={handleDimensionChange(dimension)}
                onBlur={handleDimensionBlur(dimension)}
                className="w-12 py-2 px-2 border-b box-border focus:border-black hover:border-black bg-white focus:outline-none text-center"
                placeholder={
                    dimension.charAt(0).toUpperCase() + dimension.slice(1)
                }
            />
        </div>
    );

    return (
        <div className="flex flex-col  h-screen w-screen text-xs text-neutral-900">
            <nav className="flex items-center justify-between px-4 py-2 border-b border-black">
                <div>
                    <a
                        href="#"
                        className="text-6xl tracking-tighter font-medium"
                    >
                        GENERATE YOUR BOX MOCKUP
                    </a>
                </div>
                {/* <div>
                    <a href="#" className="px-4 py-2 hover:bg-gray-700">
                        Home
                    </a>
                    <a href="#" className="px-4 py-2 hover:bg-gray-700">
                        About
                    </a>
                    <a href="#" className="px-4 py-2 hover:bg-gray-700">
                        Contact
                    </a>
                </div> */}
            </nav>
            <div className="flex-grow overflow-auto">
                <div className="flex h-full">
                    <div className="w-1/2 h-full flex flex-col p-4">
                        <div className="flex flex-col gap-4">
                            <DynamicScene
                                dimensions={dimensions}
                                canvasRef={canvasRef}
                            />
                            <div className="flex flex-col gap-2">
                                {renderDimensionInput("width")}
                                {renderDimensionInput("height")}
                                {renderDimensionInput("depth")}
                            </div>
                            <button
                                className="w-max py-2 px-4 border border-black box-border bg-white hover:bg-black hover:text-white"
                                onClick={exportScene}
                            >
                                RENDER
                            </button>
                            <button
                                className="w-max py-2 px-4 border border-black box-border bg-white hover:bg-black hover:text-white"
                                onClick={downloadImage}
                            >
                                DOWNLOAD
                            </button>
                        </div>
                    </div>
                    <div className="w-px bg-black h-full" />
                    <div className="w-1/2 h-full overflow-y-auto">
                        <div className="p-4">
                            <PredictionResults prediction={prediction} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const PredictionResults = ({ prediction }) => {
    if (!prediction) {
        return (
            <div>No results to display or prediction is not successful.</div>
        );
    } else if (prediction.status == "processing") {
        return <div>{prediction.logs}</div>;
    } else if (prediction.status == "starting") {
        return (
            <div>
                {
                    "It takes 20s usually, but it can be slower when first boot! Please do not leave page."
                }
            </div>
        );
    }

    return (
        <div>
            <h2>Output</h2>
            <div className="flex flex-col gap-4">
                {prediction.output?.map((imageUrl, index) => (
                    <div
                        key={index}
                        className={`${index === 0 ? "hidden" : ""}`}
                    >
                        <img
                            src={imageUrl}
                            alt={`AI generated white paper box mockup ${index}`}
                            className="w-max"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
