/* eslint-disable react-refresh/only-export-components */
import {
  ActiveSelection,
  Canvas,
  FabricObject,
  TEvent,
  TPointerEvent,
} from "fabric";
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
    if (!canvas || selected === null) return;

    if (selected.length <= 1) {
      canvas._setActiveObject(selected[0]);
    } else if (selected.length > 1) {
      const sel = new ActiveSelection(selected ?? [], {
        canvas: canvas,
      });
      canvas._setActiveObject(sel);
    }

    canvas.renderAll();
  }, [canvas, selected]);

  useEffect(() => {
    if (canvas) {
      const select = (
        options: Partial<TEvent<TPointerEvent>> & {
          selected: FabricObject[];
          deselected: FabricObject[];
        }
      ) => {
        if (options.e?.shiftKey) {
          setSelected([...(selected ?? []), ...options.selected]);
        } else {
          setSelected(options.selected);
        }
      };

      const clearSelect = () => {
        setSelected(null);
        canvas._discardActiveObject();
        canvas.renderAll();
      };

      canvas.on("selection:created", select);
      canvas.on("selection:updated", select);

      canvas.on("selection:cleared", clearSelect);

      return () => {
        canvas.off("selection:created", select);
        canvas.off("selection:updated", select);
        canvas.off("selection:cleared", clearSelect);
      };
    }
  }, [canvas, selected]);

  return (
    <SelectionContext.Provider value={[selected, setSelected]}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  return useContext(SelectionContext) ?? [null, () => {}];
}
