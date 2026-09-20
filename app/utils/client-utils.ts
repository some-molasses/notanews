"use client";

import { useState } from "react";

export function useArrayState<T, Id>(
  defaultValue: T[],
  getId: (t: T) => Id,
): [T[], (newVal: T) => void, (newVal: T, id: Id) => void, (id: Id) => void] {
  const [array, setArray] = useState<T[]>(defaultValue);

  const addElement = (newVal: T) => setArray([...array, newVal]);
  const updateElement = (newVal: T) =>
    setArray(array.map((val) => (getId(val) === getId(newVal) ? newVal : val)));
  const deleteElement = (id: Id) =>
    setArray(array.filter((val: T) => getId(val) !== id));

  return [array, addElement, updateElement, deleteElement];
}
