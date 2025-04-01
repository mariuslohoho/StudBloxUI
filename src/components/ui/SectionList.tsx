import { Bold, Italic, Underline } from "lucide-react";
import React from "react";
import { Label } from "./label";
import { Separator } from "./separator";
import { Toggle } from "./toggle";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

interface SectionListProps extends React.PropsWithChildren {
  className?: string;
}
export function SectionList(props: SectionListProps) {
  const items = React.Children.toArray(props.children);
  const last = items.length - 1;

  return (
    <>
      {items.map((child, index) => {
        return (
          <React.Fragment key={index}>
            <Separator className="my-3" />
            {child}
            {index == last ? <Separator className="my-3" /> : null}
          </React.Fragment>
        );
      })}
    </>
  );
}

interface SectionProps extends React.PropsWithChildren {
  title: string;
  ["header-toggles"]?: {
    value: string;
    children: string | React.ReactNode;

    ["aria-label"]?: string;
  }[];
  defaultValue?: string;
}
export function Section(props: SectionProps) {
  return (
    <div className="mx-3">
      <div className="flex items-center justify-between mb-4">
        <Label>{props.title}</Label>
        <ToggleGroup
          type="single"
          variant="outline"
          className="h-3"
          defaultValue={
            props.defaultValue || props["header-toggles"]?.[0]?.value
          }
        >
          {(props["header-toggles"] || []).map((item) => (
            <ToggleGroupItem
              value={item.value}
              aria-label={item["aria-label"]}
              className="h-7"
            >
              {item.children}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      {props.children}
    </div>
  );
}
