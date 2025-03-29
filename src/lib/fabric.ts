import { FabricObject, StaticCanvas } from "fabric";

type UID = number;

declare module "fabric" {
  interface FabricObject {
    UID: UID;
    Name: string;
    Children?: UID[];

    isChildren?: boolean;

    UIStroke?: boolean;
    UIStrokeWidth?: number;
    UIStrokeColor?: string;
  }

  interface SerializedObjectProps {
    UID: UID;
    Name: string;
    Children?: UID[];

    isChildren?: boolean;

    UIStroke?: boolean;
    UIStrokeWidth?: number;
    UIStrokeColor?: string;
  }
}

FabricObject.customProperties = [
  "UID",
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
