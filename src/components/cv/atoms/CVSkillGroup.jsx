import React from "react";
import { cvTokens, cssColor, ptToRem } from "../../../cv-tokens";

export default function CVSkillGroup({
  label,
  items = [],
  variant = "sidebar",
  format = "bullets", // "bullets" or "inline"
}) {
  const isSidebar = variant === "sidebar";

  if (format === "inline") {
    return (
      <p className="mb-2" style={{ fontFamily: cvTokens.fonts.primary, fontSize: ptToRem(cvTokens.fontSize.body), color: cssColor(cvTokens.colors.mainText) }}>
        <span style={{ fontWeight: 600, color: cssColor(cvTokens.colors.mainHeading) }}>{label}: </span>
        {items.join(", ")}
      </p>
    );
  }

  // bullets format (sidebar)
  return (
    <div className="mb-3">
      <p
        className="mb-1"
        style={{
          fontFamily: cvTokens.fonts.primary,
          fontSize: ptToRem(cvTokens.fontSize.small),
          fontWeight: 600,
          color: cssColor(isSidebar ? cvTokens.colors.sidebarMuted : cvTokens.colors.mainHeading),
        }}
      >
        {label}
      </p>
      {items.map((s, j) => (
        <p
          key={j}
          style={{
            fontFamily: cvTokens.fonts.primary,
            fontSize: ptToRem(cvTokens.fontSize.small),
            color: cssColor(isSidebar ? cvTokens.colors.sidebarDimmed : cvTokens.colors.mainText),
          }}
        >
          • {s}
        </p>
      ))}
    </div>
  );
}
