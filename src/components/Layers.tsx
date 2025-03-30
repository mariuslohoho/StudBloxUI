import { useSelection } from "@/context/useSelection";
import { Canvas, FabricObject } from "fabric";
import { useEffect, useMemo, useState } from "react";
import {
  ControlledTreeEnvironment,
  DraggingPosition,
  InteractionMode,
  Tree,
  TreeItem,
  TreeItemIndex,
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
      const objects = canvas?.getObjects();

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

  const onDrop = (
    items: TreeItem<FabricObject>[],
    target: DraggingPosition
  ) => {
    if (target.targetType === "item") {
      setLayers((prev) => {
        if (!prev) return prev;
        const parent = prev?.findIndex(
          (item) => item.UID === target.targetItem
        );

        if (!prev[parent]) return prev;

        items.forEach((item) => {
          prev.forEach((layer) => {
            if (layer.Children?.includes(item.index as number)) {
              layer.Children = layer.Children.filter(
                (child) => child !== item.index
              );
            }
          });
        });

        const movedItems = items
          .map((item) => {
            const layer = prev.find(
              (layer) => layer.UID === item.data.UID
            );
            if (layer) {
              layer.isChildren = true;
            }
            return layer?.UID;
          })
          .filter(Boolean) as number[];

        prev[parent].Children = [
          ...new Set([...(prev[parent].Children || []), ...movedItems]),
        ];

        return [...prev];
      });
    } else if (target.targetType === "root") {
      // Never triggered this event before
      setLayers((prev) => {
        if (!prev) return prev;
        items.forEach((item) => (prev[item.data.UID].isChildren = false));
        prev.map((item) => ({
          ...item,
          Children:
            item.Children?.filter(
              (child) => !items.find((i) => i.data.UID === child)
            ) ?? [],
        }));
        return [...prev];
      });
    } else if (target.targetType === "between-items") {
      setLayers((prev) => {
        if (!prev) return prev;

        items.forEach((item) => {
          prev.forEach((layer) => {
            if (layer.Children?.includes(item.index as number)) {
              layer.Children = layer.Children.filter(
                (child) => child !== item.index
              );
            }
          });
        });

        const parent = prev.findIndex(
          (item) => item.UID === target.parentItem
        );

        prev[parent]?.Children?.insertArray(
          items.map((item) => item.data.UID),
          target.childIndex
        );

        if (target.depth > 0) {
          items.forEach((item) => {
            item.data.isChildren = true;
          });
        } else {
          items.forEach((item) => {
            item.data.isChildren = false;
          });
        }

        return [...prev];
      });
    }
  };

  const items: Record<
    TreeItemIndex,
    TreeItem<FabricObject>
  > = useMemo(() => {
    const entries: Record<number, object> = {};
    for (const item of layers ?? []) {
      entries[item.UID] = {
        index: item.UID,
        canMove: true,
        isFolder: (item.Children?.length ?? 0) > 0,
        canRename: true,
        data: item,
        children: item.Children ?? [],
      };
    }

    return {
      root: {
        index: "root",
        isFolder: true,
        data: null as unknown as FabricObject,
        children: (layers ?? [])
          .filter((item) => !item.isChildren)
          .map((item) => item.UID),
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
          getItemTitle={(item: TreeItem<FabricObject>) =>
            `${item.data.Name}(${item.data.UID})`
          }
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
          //
          onDrop={onDrop}
          //
        >
          <Tree treeId="layers" rootItem="root" treeLabel="Test"></Tree>
        </ControlledTreeEnvironment>
      ) : (
        <p>No layers</p>
      )}
    </div>
  );
}
