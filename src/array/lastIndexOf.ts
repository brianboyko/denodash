import findLastIndex from "./findLastIndex.ts";

export const lastIndexOf = <T>(arr: T[], target: T): number =>
  findLastIndex(arr, (elem: T): boolean => elem === target);

export default lastIndexOf;
