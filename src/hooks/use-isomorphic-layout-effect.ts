import { useEffect, useLayoutEffect } from "react";

// useLayoutEffect on the client (runs before paint → no animation flash),
// useEffect on the server to avoid the SSR warning.
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
