import { useRef } from "react";
import Moveable from "react-moveable";

const ImageComponent = ({ src, alt, isSelected, onSelected, zIndex }) => {
    const targetRef = useRef();
    const moveableRef = useRef();
    return (
        // <div className={`relative w-full h-full`} onClick={onSelected}>
        <>
            <img
                ref={targetRef}
                src={src}
                alt={alt}
                className="w-full h-auto object-contain absolute"
                onClick={onSelected}
                onDragStart={(e) => e.preventDefault()}
            />
            {isSelected && (
                <Moveable
                    ref={moveableRef}
                    target={targetRef}
                    draggable={true}
                    throttleDrag={1}
                    edgeDraggable={false}
                    startDragRotate={0}
                    throttleDragRotate={0}
                    resizable={true}
                    keepRatio={false}
                    throttleResize={1}
                    renderDirections={["nw", "ne", "sw", "se"]}
                    rotatable={true}
                    throttleRotate={0}
                    rotationPosition={"top"}
                    onDrag={(e) => {
                        e.target.style.transform = e.transform;
                    }}
                    onResize={(e) => {
                        e.target.style.width = `${e.width}px`;
                        e.target.style.height = `${e.height}px`;
                        e.target.style.transform = e.drag.transform;
                    }}
                    onRotate={(e) => {
                        e.target.style.transform = e.drag.transform;
                    }}
                />
            )}
        </>
        // </div>
    );
};

export default ImageComponent;
