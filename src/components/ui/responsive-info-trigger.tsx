"use client";

import * as React from "react";
import { useIsHoverDevice } from "@/hooks/use-is-hover-device";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ResponsiveInfoTriggerProps {
  triggerText: React.ReactNode;
  content: React.ReactNode;
  title?: string;
}

export function ResponsiveInfoTrigger({
  triggerText,
  content,
  title,
}: ResponsiveInfoTriggerProps) {
  const [isMounted, setIsMounted] = React.useState(false);
  const isHoverDevice = useIsHoverDevice();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const triggerElement = (
    <span className="text-primary cursor-pointer font-semibold underline decoration-dotted underline-offset-4">
      {triggerText}
    </span>
  );

  if (!isMounted) {
    return triggerElement;
  }

  if (isHoverDevice) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{triggerElement}</TooltipTrigger>
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{triggerElement}</SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{content}</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
