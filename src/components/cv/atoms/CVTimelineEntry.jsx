import React from "react";
import { cvTokens, cssColor, ptToRem } from "../../../cv-tokens";
import { formatYearRange } from "../ItemModal";
import CVBulletList from "./CVBulletList";

export default function CVTimelineEntry({
  years,
  primary,
  secondary,
  description,
  bullets,
  variant = "main",
  layout = "inline", // "inline" = date beside title (sidebar template), "stacked" = date right-aligned on title line (ATS)
}) {
  const displayYears = typeof years === "object" ? formatYearRange(years) : years;
  const colors = {
    title: cssColor(cvTokens.colors.mainHeading),
    secondary: cssColor(cvTokens.colors.mainSecondary),
    body: cssColor(cvTokens.colors.mainText),
    muted: cssColor(cvTokens.colors.mainMuted),
  };

  if (layout === "stacked") {
    return (
      <div className="mb-4">
        <div className="flex justify-between items-baseline">
          <p style={{ fontFamily: cvTokens.fonts.primary, fontSize: ptToRem(cvTokens.fontSize.itemTitle), fontWeight: 700, color: colors.title }}>
            {primary}
          </p>
          {displayYears && (
            <span style={{ fontFamily: cvTokens.fonts.primary, fontSize: ptToRem(cvTokens.fontSize.small), color: colors.muted, flexShrink: 0, marginLeft: "1rem" }}>
              {displayYears}
            </span>
          )}
        </div>
        {secondary && (
          <p style={{ fontFamily: cvTokens.fonts.primary, fontSize: ptToRem(cvTokens.fontSize.body), fontStyle: "italic", color: colors.secondary }} className="mb-1">
            {secondary}
          </p>
        )}
        {description && (
          <p style={{ fontFamily: cvTokens.fonts.primary, fontSize: ptToRem(cvTokens.fontSize.small), color: colors.body }} className="mb-1">
            {description}
          </p>
        )}
        <CVBulletList items={bullets} variant={variant} />
      </div>
    );
  }

  // inline layout (default) — date column beside content
  return (
    <div className="mb-5 flex gap-4">
      <div className="w-28 flex-shrink-0 pt-0.5" style={{ fontFamily: cvTokens.fonts.primary, fontSize: ptToRem(cvTokens.fontSize.small), color: colors.muted }}>
        {displayYears}
      </div>
      <div>
        <p style={{ fontFamily: cvTokens.fonts.primary, fontSize: ptToRem(cvTokens.fontSize.itemTitle), fontWeight: 700, color: colors.title }}>
          {primary}
        </p>
        {secondary && (
          <p style={{ fontFamily: cvTokens.fonts.primary, fontSize: ptToRem(cvTokens.fontSize.body), fontStyle: "italic", color: colors.secondary }} className="mb-1">
            {secondary}
          </p>
        )}
        {description && (
          <p style={{ fontFamily: cvTokens.fonts.primary, fontSize: ptToRem(cvTokens.fontSize.small), color: colors.body }} className="mb-1">
            {description}
          </p>
        )}
        <CVBulletList items={bullets} variant={variant} />
      </div>
    </div>
  );
}
