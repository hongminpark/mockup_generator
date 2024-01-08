// src/components/LayerControls.jsx

function LayerControls({ currentLayer, setLayers, layer }) {
    const onPositionChange = (axis, value) => {
        if (currentLayer !== undefined) {
            setLayers((prevLayers) => {
                const updatedLayers = [...prevLayers];
                updatedLayers[currentLayer].position = [
                    ...updatedLayers[currentLayer].position,
                ];
                updatedLayers[currentLayer].position[axis] = value;
                return updatedLayers;
            });
        }
    };

    const onScaleChange = (value) => {
        if (currentLayer !== undefined) {
            setLayers((prevLayers) => {
                const updatedLayers = [...prevLayers];
                updatedLayers[currentLayer].scale = value;
                return updatedLayers;
            });
        }
    };

    const onRotationChange = (axis, value) => {
        if (currentLayer !== undefined) {
            setLayers((prevLayers) => {
                const updatedLayers = [...prevLayers];
                updatedLayers[currentLayer].rotation = [
                    ...updatedLayers[currentLayer].rotation,
                ];
                updatedLayers[currentLayer].rotation[axis] = value;
                return updatedLayers;
            });
        }
    };
    return (
        <div className="flex flex-col gap-2">
            <div>MOVE</div>
            <div className="flex flex-row gap-4 items-center">
                <span>X</span>
                <input
                    className="slider-range w-full"
                    type="range"
                    min="-5"
                    max="5"
                    step="0.1"
                    value={layer.position[0]}
                    onChange={(e) =>
                        onPositionChange(0, parseFloat(e.target.value))
                    }
                />
            </div>
            <div className="flex flex-row gap-4 items-center">
                <span>Y</span>
                <input
                    className="w-full slider-range "
                    type="range"
                    min="-5"
                    max="5"
                    step="0.1"
                    value={layer.position[1]}
                    onChange={(e) =>
                        onPositionChange(1, parseFloat(e.target.value))
                    }
                />
            </div>
            <div className="flex flex-row gap-4 items-center">
                <span>SCALE</span>
                <input
                    className="w-full slider-range "
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={layer.scale}
                    onChange={(e) => onScaleChange(parseFloat(e.target.value))}
                />
            </div>
            <div>ROTATE</div>
            <div className="flex flex-row gap-4 items-center">
                <span>X</span>
                <input
                    className="w-full slider-range"
                    type="range"
                    min="-5"
                    max="5"
                    step="0.1"
                    value={layer.rotation[0]}
                    onChange={(e) =>
                        onRotationChange(0, parseFloat(e.target.value))
                    }
                />
            </div>
            <div className="flex flex-row gap-4 items-center">
                <span>Y</span>
                <input
                    className="w-full slider-range"
                    type="range"
                    min="-5"
                    max="5"
                    step="0.1"
                    value={layer.rotation[1]}
                    onChange={(e) =>
                        onRotationChange(1, parseFloat(e.target.value))
                    }
                />
            </div>
            <div className="flex flex-row gap-4 items-center">
                <span>Z</span>
                <input
                    className="w-full slider-range"
                    type="range"
                    min={`${-Math.PI * 2}`}
                    max={`${Math.PI * 2}`}
                    step="0.1"
                    value={layer.rotation[2]}
                    onChange={(e) =>
                        onRotationChange(2, parseFloat(e.target.value))
                    }
                />
            </div>
        </div>
    );
}

export default LayerControls;
