import { FabricObject, StaticCanvas } from "fabric";

type UID = number;
type UDim2 = {
  X: { Scale: number; Offset: number };
  Y: { Scale: number; Offset: number };
};
type Vector2 = {
  X: number;
  Y: number;
};
declare module "fabric" {
  interface FabricObject {
    UID: UID;
    Name: string;
    Children?: UID[];

    isChildren?: boolean;

    AnchorPoint?: Vector2;
    Position?: UDim2;

    UIStroke?: boolean;
    UIStrokeWidth?: number;
    UIStrokeColor?: string;
  }

  interface SerializedObjectProps {
    UID: UID;
    Name: string;
    Children?: UID[];

    isChildren?: boolean;

    AnchorPoint?: Vector2;
    Position?: UDim2;

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

  "AnchorPoint",
  "Position",

  "UIStroke",
  "UIStrokeWidth",
  "UIStrokeColor",
];

StaticCanvas.prototype.toObject = (function (originFn) {
  return function (this: StaticCanvas) {
    return originFn.call(this, FabricObject.customProperties);
  };
})(StaticCanvas.prototype.toObject);
