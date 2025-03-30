import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

declare global {
  interface Array<T> {
    move(from: number, to: number): void;
    insert(item: T, index: number): void;
    insertArray(item: Array<T>, index: number): void;
  }
}

Array.prototype.move = function (from: number, to: number): void {
  this.splice(to, 0, this.splice(from, 1)[0]);
};

Array.prototype.insert = function <T>(item: T, index: number): void {
  this.splice(index, 0, item);
};

Array.prototype.insertArray = function <T>(
  items: Array<T>,
  index: number
): void {
  this.splice(index, 0, ...items);
};
