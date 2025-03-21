import { useSelection } from "@/context/useSelection";
import { Canvas, FabricObject } from "fabric";
import { useEffect, useMemo, useState } from "react";
import {
  ControlledTreeEnvironment,
  InteractionMode,
  Tree,
  TreeItem,
} from "react-complex-tree";

interface LayersProps {
  canvas: Canvas | null;
}

type UID = number;

export default function Layers({ canvas }: LayersProps) {
  const [layers, setLayers] = useState<FabricObject[] | null>(null);

  const [focusedItem, setFocusedItem] = useState<UID>(0);
  const [expandedItems, setExpandedItems] = useState<UID[]>([]);

  const [selected, setSelected] = useSelection();

  useEffect(() => {
    const updateLayers = () => {
      const objects = canvas
        ?.getObjects()
        .filter((obj) => !obj.isChildren);

      setLayers((objects ?? []).reverse());
    };

    if (canvas) {
      canvas.on("object:added", updateLayers);
      canvas.on("object:modified", updateLayers);
      canvas.on("object:removed", updateLayers);

      return () => {
        canvas.off("object:added", updateLayers);
        canvas.off("object:modified", updateLayers);
        canvas.off("object:removed", updateLayers);
      };
    }
  }, [canvas]);

  const items = useMemo(() => {
    const entries = Object.fromEntries(
      (layers ?? [])
        .filter((item) => !item.isChildren)
        .map((item) => [
          item.UID,
          {
            index: item.UID,
            canMove: true,
            isFolder: (item.Children?.length ?? 0) > 0,
            canRename: true,
            data: item,
          },
        ])
    );

    return {
      root: {
        index: "root",
        isFolder: true,
        data: null as unknown as FabricObject,
        children: (layers ?? []).map((item) => item.UID),
      },
      ...entries,
    };
  }, [layers]);

  return (
    <div className="absolute bg-white h-full w-1/6 top-0 left-0 p-2 rounded-2xl box-border bg-clip-content">
      <h1>Layers</h1>
      {canvas !== null && layers !== null ? (
        <ControlledTreeEnvironment
          canDragAndDrop
          canDropOnFolder
          canDropOnNonFolder
          canReorderItems
          defaultInteractionMode={InteractionMode.DoubleClickItemToExpand}
          //
          viewState={{
            ["layers"]: {
              focusedItem,
              selectedItems: selected?.map((item) => item.UID) ?? [],
              expandedItems,
            },
          }}
          getItemTitle={(item: TreeItem<FabricObject>) => item.data.Name}
          items={items}
          //
          onFocusItem={(item) => setFocusedItem(item.data.UID)}
          //
          onExpandItem={(item) =>
            setExpandedItems([...expandedItems, item.data.UID])
          }
          onCollapseItem={(item) =>
            setExpandedItems(
              expandedItems.filter((uid) => uid !== item.data.UID)
            )
          }
          //
          onSelectItems={(uids) => {
            return setSelected(
              uids.map(
                (uid) =>
                  layers.find((item) => item.UID === uid) as FabricObject
              )
            );
          }}
        >
          <Tree treeId="layers" rootItem="root" treeLabel="Test"></Tree>
        </ControlledTreeEnvironment>
      ) : (
        <p>No layers</p>
      )}
    </div>
  );
}
