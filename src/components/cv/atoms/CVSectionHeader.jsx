import React from "react";
import { cvTokens, cssColor, ptToRem } from "../../../cv-tokens";

export default function CVSectionHeader({ title, variant = "main" }) {
  const isSidebar = variant === "sidebar";

  return (
    <h2
      className="uppercase tracking-wider pb-1 mb-3"
      style={{
        fontFamily: cvTokens.fonts.heading,
        fontSize: ptToRem(isSidebar ? cvTokens.fontSize.sidebarSectionHeading : cvTokens.fontSize.sectionHeading),
        fontWeight: 700,
        color: isSidebar
          ? cssColor(cvTokens.colors.sidebarText)
          : cssColor(cvTokens.colors.mainHeading),
        borderBottom: `2px solid ${cssColor(isSidebar ? cvTokens.colors.sidebarBorder : cvTokens.colors.mainBorder)}`,
      }}
    >
      {title}
    </h2>
  );
}
