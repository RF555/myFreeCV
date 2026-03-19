import React from "react";
import { cvTokens, cssColor, ptToRem } from "../../../cv-tokens";

export default function CVSummary({ text }) {
  if (!text) return null;

  return (
    <p
      className="leading-relaxed"
      style={{
        fontFamily: cvTokens.fonts.primary,
        fontSize: ptToRem(cvTokens.fontSize.body),
        color: cssColor(cvTokens.colors.mainText),
      }}
    >
      {text}
    </p>
  );
}
