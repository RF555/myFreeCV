import React from "react";
import { cvTokens, cssColor, ptToRem } from "../../../cv-tokens";

export default function CVBulletList({ items, variant = "main" }) {
  if (!items?.length) return null;

  const isSidebar = variant === "sidebar";
  const color = isSidebar
    ? cssColor(cvTokens.colors.sidebarDimmed)
    : cssColor(cvTokens.colors.mainText);

  return (
    <>
      {items.map((item, i) => (
        <p
          key={i}
          className="mb-0.5"
          style={{
            fontFamily: cvTokens.fonts.primary,
            fontSize: ptToRem(cvTokens.fontSize.small),
            color,
          }}
        >
          • {item}
        </p>
      ))}
    </>
  );
}
