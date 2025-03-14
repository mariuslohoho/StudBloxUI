import { Canvas, Rect } from "fabric";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import Layers from "./components/Layers.tsx";
import Properties from "./components/Properties.tsx";
import { Button } from "./components/ui/button";
import { SelectionProvider } from "./context/useSelection.tsx";

import "./lib/fabric.ts";

function App() {
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const addRect = () => {
    if (canvas) {
      const rect = new Rect({
        top: 100,
        left: 50,
        width: 100,
        height: 60,
        fill: "#fff",
        stroke: "#000",
        strokeWidth: 2,
        strokeUniform: true,

        Name: "Frame",
        UIStroke: true,
      });

      canvas.add(rect);
      rect.on("mouseover", () => {
        rect.set("fill", "#f0f0f0");
        canvas.renderAll();
      });
      rect.on("mouseout", () => {
        rect.set("fill", "#fff");
        canvas.renderAll();
      });

      return rect;
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: 500,
        height: 500,
      });

      initCanvas.backgroundColor = "#fff";
      initCanvas.renderAll();
      initCanvas.preserveObjectStacking = true;

      setCanvas(initCanvas);

      return () => {
        initCanvas.dispose();
      };
    }
  }, []);

  document.addEventListener("keydown", (e) => {
    if (!e.ctrlKey) return;

    if (e.key === "z" && canvas) {
      canvas.undo();
    }

    if (e.key === "y" && canvas) {
      canvas.redo();
    }
  });

  return (
    <SelectionProvider canvas={canvas}>
      <div className="mb-2 gap-1.5 flex justify-center">
        <Button className="InsertItem select-none" onMouseDown={addRect}>
          Insert Frame
        </Button>
        <Button
          onMouseDown={() => {
            console.log(canvas?.toObject());
          }}
        >
          Debug:Print
        </Button>
      </div>
      <canvas id="canvas" ref={canvasRef}></canvas>
      <Layers canvas={canvas} />
      <Properties canvas={canvas} />
    </SelectionProvider>
  );
}

export default App;
