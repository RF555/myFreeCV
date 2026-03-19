import React from "react";
import { cvTokens, cssColor, ptToRem } from "../../../cv-tokens";

export default function CVReferenceCard({ name, title, organization, phone, email, variant = "main" }) {
  const isSidebar = variant === "sidebar";
  const headingColor = isSidebar ? cssColor(cvTokens.colors.sidebarText) : cssColor(cvTokens.colors.mainHeading);
  const secondaryColor = isSidebar ? cssColor(cvTokens.colors.sidebarMuted) : cssColor(cvTokens.colors.mainSecondary);
  const mutedColor = isSidebar ? cssColor(cvTokens.colors.sidebarMuted) : cssColor(cvTokens.colors.mainMuted);

  return (
    <div>
      <p style={{ fontFamily: cvTokens.fonts.primary, fontSize: ptToRem(cvTokens.fontSize.itemTitle), fontWeight: 700, color: headingColor }}>
        {name}
      </p>
      {title && (
        <p style={{ fontFamily: cvTokens.fonts.primary, fontSize: ptToRem(cvTokens.fontSize.small), color: secondaryColor }}>
          {title}{organization ? `, ${organization}` : ""}
        </p>
      )}
      {!title && organization && (
        <p style={{ fontFamily: cvTokens.fonts.primary, fontSize: ptToRem(cvTokens.fontSize.small), color: secondaryColor }}>
          {organization}
        </p>
      )}
      {phone && (
        <p className="mt-0.5" style={{ fontFamily: cvTokens.fonts.primary, fontSize: ptToRem(cvTokens.fontSize.small), color: mutedColor }}>
          {phone}
        </p>
      )}
      {email && (
        <p style={{ fontFamily: cvTokens.fonts.primary, fontSize: ptToRem(cvTokens.fontSize.small), color: mutedColor }}>
          {email}
        </p>
      )}
    </div>
  );
}
