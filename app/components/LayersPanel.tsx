import { EyeIcon, EyeSlashIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useCallback, useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Layer = ({
    id,
    layer,
    index,
    moveLayer,
    onToggle,
    onClick,
    onDelete,
    isSelected,
}) => {
    const ref = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    const [, drop] = useDrop({
        accept: ItemTypes.LAYER,
        hover(item) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) {
                return;
            }
            moveLayer(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.LAYER,
        item: { id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <div
            ref={ref}
            className={`flex items-center justify-between px-2 py-1 ${
                isSelected ? "bg-blue-100" : ""
            } border ${
                isHovered ? "hover:border-blue-500" : "border-transparent"
            } ${isDragging ? "opacity-40" : ""}`}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center">
                <div className="w-8 h-8 mr-2 overflow-hidden flex items-center justify-center">
                    <img
                        src={layer.url}
                        alt="Layer Preview"
                        className="w-auto h-4 object-contain"
                    />
                </div>
                <span>{layer.name}</span>
            </div>
            {isHovered && (
                <div className="flex items-center gap-2">
                    {layer.visible ? (
                        <EyeIcon
                            className="h-3 w-3 hover:cursor-pointer"
                            onClick={onToggle}
                        />
                    ) : (
                        <EyeSlashIcon
                            className="h-3 w-3 hover:cursor-pointer"
                            onClick={onToggle}
                        />
                    )}
                    <TrashIcon
                        className="h-3 w-3 hover:cursor-pointer"
                        onClick={onDelete}
                    />
                    <button className="hover:text-gray-300">
                        <span>&#8942;</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default function LayerList({
    layers,
    setLayers,
    currentLayer,
    setCurrentLayer,
}) {
    const moveLayer = useCallback(
        (dragIndex, hoverIndex) => {
            const dragLayer = layers[dragIndex];
            const updatedLayers = [...layers];
            updatedLayers.splice(dragIndex, 1);
            updatedLayers.splice(hoverIndex, 0, dragLayer);
            setLayers(updatedLayers);
        },
        [layers, setLayers]
    );

    const toggleVisibility = (index) => {
        setLayers((layers) =>
            layers.map((layer, i) =>
                i === index ? { ...layer, visible: !layer.visible } : layer
            )
        );
    };
    const deleteItem = (index) => {
        setLayers((layers) => layers.filter((_, i) => i !== index));
    };
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="w-full">
                {layers.map((layer, index) => (
                    <Layer
                        key={index}
                        id={index}
                        index={index}
                        layer={layer}
                        moveLayer={moveLayer}
                        onToggle={() => toggleVisibility(index)}
                        onClick={() => setCurrentLayer(index)}
                        onDelete={() => deleteItem(index)}
                        isSelected={currentLayer === index}
                    />
                ))}
            </div>
        </DndProvider>
    );
}

const ItemTypes = {
    LAYER: "layer",
};
