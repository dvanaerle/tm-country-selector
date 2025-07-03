"use client";

import { useEffect, useState } from "react";

export function useIsHoverDevice() {
  const [isHoverDevice, setIsHoverDevice] = useState(false);

  useEffect(() => {
    // A device is considered a "hover device" if its primary input mechanism can hover.
    const isHover = window.matchMedia("(hover: hover)").matches;
    setIsHoverDevice(isHover);
  }, []);

  return isHoverDevice;
}
