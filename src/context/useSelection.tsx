/* eslint-disable react-refresh/only-export-components */
import { Canvas, FabricObject } from "fabric";
import { createContext, useContext, useEffect, useState } from "react";

const SelectionContext = createContext<FabricObject[] | null>(null);

export function SelectionProvider({
  children,
  canvas,
}: {
  children: React.ReactNode;
  canvas: Canvas | null;
}) {
  const [selected, setSelected] = useState<FabricObject[] | null>(null);

  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", (e) => {
        setSelected(e.selected);
      });

      canvas.on("selection:updated", (e) => {
        setSelected(e.selected);
      });

      canvas.on("selection:cleared", () => {
        setSelected(null);
      });
    }
  }, [canvas]);

  return (
    <SelectionContext.Provider value={selected}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  return useContext(SelectionContext) ?? [];
}
