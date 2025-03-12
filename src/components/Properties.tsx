// import { useSelection } from "@/context/useSelection";
import { Canvas } from "fabric";
import { useEffect } from "react";

export default function Properties({ canvas }: { canvas: Canvas | null }) {
  // const selectedObject = useSelection();

  useEffect(() => {
    if (canvas) {
      canvas.renderAll();
    }
  }, [canvas]);

  return (
    <div className="absolute bg-white h-full w-1/6 top-0 right-0 p-2 rounded-2xl box-border bg-clip-content">
      Properties
    </div>
  );
}
