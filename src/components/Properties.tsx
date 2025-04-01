// import { useSelection } from "@/context/useSelection";
import { Canvas } from "fabric";
import { useEffect } from "react";
import { Section, SectionList } from "./ui/SectionList.tsx";
import Input from "./ui/custom/input.tsx";
import { Label } from "./ui/label.tsx";

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
      <SectionList>
        <Section
          title="Position"
          header-toggles={[
            { value: "Scale", children: "Scale" },
            { value: "Offset", children: "Offset" },
          ]}
        >
          <Label>Anchor Point</Label>
          <div className="flex gap-1 my-1">
            <Input label="X" />
            <Input label="Y" />
          </div>
        </Section>
        <Section title="Position"></Section>
        <Section title="Position"></Section>
      </SectionList>
    </div>
  );
}
