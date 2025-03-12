declare module "fabric" {
  interface Canvas {
    undo: () => void;
    redo: () => void;
  }
}
