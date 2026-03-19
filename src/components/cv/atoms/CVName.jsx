import React from "react";
import { cvTokens, cssColor, ptToRem } from "../../../cv-tokens";

export default function CVName({ name, variant = "main" }) {
  const color = variant === "sidebar"
    ? cssColor(cvTokens.colors.sidebarText)
    : cssColor(cvTokens.colors.mainHeading);

  return (
    <h1
      style={{
        fontFamily: cvTokens.fonts.heading,
        fontSize: ptToRem(cvTokens.fontSize.name),
        color,
        fontWeight: 700,
        lineHeight: 1.2,
      }}
    >
      {name || "Your Name"}
    </h1>
  );
}
