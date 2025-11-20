// Utility functions for wizard framework

import React from "react";
import { Asterisk as Icons } from "lucide-react";
import type { WizardOption } from "./types";

/**
 * Get icon component from name or direct reference
 */
export const getIcon = (name?: string, direct?: React.ElementType): React.ElementType | null => {
  if (direct) return direct;
  if (name && (Icons as any)[name]) return (Icons as any)[name];
  return null;
};

/**
 * Get badge CSS classes based on color
 */
export const getBadgeClasses = (color?: WizardOption["badgeColor"]) => {
  switch (color) {
    case "green":
      return "bg-green-500/10 text-green-300 border-green-500/20";
    case "blue":
      return "bg-sky-500/10 text-sky-300 border-sky-500/20";
    case "orange":
    default:
      return "bg-orange-500/10 text-orange-300 border-orange-500/20";
  }
};

