import React, { useCallback, useEffect, useState } from "react";
import ImageComponent from "./ImageComponent";

const DefaultCanvas = React.forwardRef(
    (
        { layers, setLayers, currentLayer, setCurrentLayer, isOrbitEnabled },
        ref
    ) => {
        function handleDragOver(e) {
            e.preventDefault();
        }

        function handleDrop(e) {
            e.preventDefault();

            if (e.dataTransfer.items) {
                for (let i = 0; i < e.dataTransfer.items.length; i++) {
                    if (e.dataTransfer.items[i].kind === "file") {
                        let file = e.dataTransfer.items[i].getAsFile();
                        let reader = new FileReader();
                        reader.onload = (e) => {
                            setLayers((prevLayers) => [
                                ...prevLayers,
                                {
                                    name: file.name,
                                    url: e.target.result,
                                    position: [0, 0, 0],
                                    scale: 1,
                                    rotation: [0, 0, 0],
                                    visible: true,
                                },
                            ]);
                        };
                        reader.readAsDataURL(file);
                    }
                }
            } else {
                for (let i = 0; i < e.dataTransfer.files.length; i++) {
                    // Process the files similarly as above
                }
            }
        }

        const [isDragging, setIsDragging] = useState(false);
        const [startX, setStartX] = useState(0);
        const [startY, setStartY] = useState(0);

        const handleMouseDown = (e) => {
            setIsDragging(true);
            setStartX(e.clientX);
            setStartY(e.clientY);
        };

        const handleMouseMove = useCallback(
            (e) => {
                if (isDragging) {
                    // Calculate the new width and height based on mouse movement
                    const currentX = e.clientX;
                    const currentY = e.clientY;
                    const dx = currentX - startX;
                    const dy = currentY - startY;

                    // Apply the delta to the element's size
                    // You need to manage the element's size state and update it here
                    setSize({
                        width: size.width + dx,
                        height: size.height + dy,
                    });
                    setStartX(currentX);
                    setStartY(currentY);
                }
            },
            [isDragging, startX, startY]
        );

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        // Add global event listeners when dragging starts
        useEffect(() => {
            if (isDragging) {
                window.addEventListener("mousemove", handleMouseMove);
                window.addEventListener("mouseup", handleMouseUp);
            }

            return () => {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mouseup", handleMouseUp);
            };
        }, [isDragging, handleMouseMove]);

        return (
            <div
                ref={ref}
                className="border border-gray-300 box-border flex flex-col w-[512px] h-[512px] relative"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {layers.map(
                    (layer, index) =>
                        layer.visible && (
                            <ImageComponent
                                key={index}
                                src={layer.url}
                                alt={`Layer ${index}`}
                                isSelected={index === currentLayer}
                                onSelected={() => {
                                    index === currentLayer
                                        ? setCurrentLayer(null)
                                        : setCurrentLayer(index);
                                }}
                                zIndex={index}
                            />
                        )
                )}
            </div>
        );
    }
);
export default DefaultCanvas;
