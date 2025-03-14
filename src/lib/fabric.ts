import { FabricObject, StaticCanvas } from "fabric";

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

StaticCanvas.prototype.toObject = (function (originFn) {
  return function (this: StaticCanvas) {
    return originFn.call(this, FabricObject.customProperties);
  };
})(StaticCanvas.prototype.toObject);
