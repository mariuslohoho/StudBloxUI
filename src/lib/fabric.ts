import { FabricObject } from "fabric";
declare module "fabric" {
  interface FabricObject {
    Name?: string;
    Children?: FabricObject[];

    isChildren?: boolean;

    UIStroke?: boolean;
    UIStrokeWidth?: number;
    UIStrokeColor?: string;
  }

  interface SerializedObjectProps {
    Name?: string;
    Children?: FabricObject[];

    isChildren?: boolean;

    UIStroke?: boolean;
    UIStrokeWidth?: number;
    UIStrokeColor?: string;
  }
}

FabricObject.customProperties = [
  "Name",
  "Children",

  "isChildren",

  "UIStroke",
  "UIStrokeWidth",
  "UIStrokeColor",
];
