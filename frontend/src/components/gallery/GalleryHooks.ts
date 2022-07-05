import { useEffect, useState } from "react";

const getPinned = () => {
  return JSON.parse(localStorage.getItem("favourites") || "[]");
};

export const useUserPinned = () => {
  const [pinned, setPinned] = useState(getPinned());
  window.addEventListener("storage", () => setPinned(getPinned()));
  return { pinned };
};
