import React from "react";
import { cvTokens, cssColor, ptToRem } from "../../../cv-tokens";

export default function CVReferenceCard({ name, title, organization, phone, email }) {
  return (
    <div>
      <p style={{ fontFamily: cvTokens.fonts.primary, fontSize: ptToRem(cvTokens.fontSize.itemTitle), fontWeight: 700, color: cssColor(cvTokens.colors.mainHeading) }}>
        {name}
      </p>
      {title && (
        <p style={{ fontFamily: cvTokens.fonts.primary, fontSize: ptToRem(cvTokens.fontSize.small), color: cssColor(cvTokens.colors.mainSecondary) }}>
          {title}{organization ? `, ${organization}` : ""}
        </p>
      )}
      {!title && organization && (
        <p style={{ fontFamily: cvTokens.fonts.primary, fontSize: ptToRem(cvTokens.fontSize.small), color: cssColor(cvTokens.colors.mainSecondary) }}>
          {organization}
        </p>
      )}
      {phone && (
        <p className="mt-0.5" style={{ fontFamily: cvTokens.fonts.primary, fontSize: ptToRem(cvTokens.fontSize.small), color: cssColor(cvTokens.colors.mainMuted) }}>
          {phone}
        </p>
      )}
      {email && (
        <p style={{ fontFamily: cvTokens.fonts.primary, fontSize: ptToRem(cvTokens.fontSize.small), color: cssColor(cvTokens.colors.mainMuted) }}>
          {email}
        </p>
      )}
    </div>
  );
}
