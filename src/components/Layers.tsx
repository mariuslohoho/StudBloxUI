import { useSelection } from "@/context/useSelection";
import { Canvas, FabricObject } from "fabric";
import { useEffect, useState } from "react";

interface LayersProps {
  canvas: Canvas | null;
}

export default function Layers({ canvas }: LayersProps) {
  const [layers, setLayers] = useState<FabricObject[] | null>(null);
  const selected = useSelection();

  useEffect(() => {
    const updateLayers = () => {
      const objects =
        canvas
          ?.getObjects()
          .filter((obj) => !obj.isChildren)
          .sort(() => {
            return 0;
          }) ?? [];

      setLayers(objects.reverse());
    };

    if (canvas) {
      canvas.on("object:added", updateLayers);
      canvas.on("object:modified", updateLayers);
      canvas.on("object:removed", updateLayers);
    }
  }, [canvas]);

  return (
    <div className="absolute bg-white h-full w-1/6 top-0 left-0 p-2 rounded-2xl box-border bg-clip-content">
      <h1>Layers</h1>
      {canvas !== null && layers !== null ? (
        <div>
          {layers.map((obj) => {
            const isSelected = selected.includes(obj);
            const layerClass = isSelected ? "bg-gray-200" : "";
            return (
              <div className={`flex items-center ${layerClass}`}>
                {obj.Name}
              </div>
            );
          })}
        </div>
      ) : (
        <p>No layers</p>
      )}
    </div>
  );
}
