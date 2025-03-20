/* eslint-disable react-refresh/only-export-components */
import { clear } from "console";
import { Canvas, FabricObject } from "fabric";
import { createContext, useContext, useEffect, useState } from "react";

const SelectionContext = createContext<
  | [
      FabricObject[] | null,
      React.Dispatch<React.SetStateAction<FabricObject[] | null>>
    ]
  | null
>(null);

export function SelectionProvider({
  children,
  canvas,
}: {
  children: React.ReactNode;
  canvas: Canvas | null;
}) {
  const [selected, setSelected] = useState<FabricObject[] | null>(null);

  useEffect(() => {
    if (!canvas) return;
    canvas._setActiveObject(selected?.[0] as FabricObject);
    canvas.renderAll();
  }, [canvas, selected]);

  useEffect(() => {
    if (canvas) {
      const select = (e: { selected: FabricObject[] }) => {
        setSelected(e.selected);
      };

      const clearSelect = () => setSelected(null);

      canvas.on("selection:created", select);

      canvas.on("selection:updated", select);

      canvas.on("selection:cleared", clearSelect);

      return () => {
        canvas.off("selection:created", select);
        canvas.off("selection:updated", select);
        canvas.off("selection:cleared", clearSelect);
      };
    }
  }, [canvas]);

  return (
    <SelectionContext.Provider value={[selected, setSelected]}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  return useContext(SelectionContext) ?? [null, () => {}];
}
