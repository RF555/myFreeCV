import React from "react";
import { cvTokens, cssColor, ptToRem } from "../../../cv-tokens";

const ensureProtocol = (url) => /^https?:\/\//.test(url) ? url : `https://${url}`;

export default function CVContactItem({ icon: Icon, text, href, variant = "main", inline = false }) {
  if (!text) return null;

  const isSidebar = variant === "sidebar";
  const color = isSidebar
    ? (href ? cssColor(cvTokens.colors.sidebarLink) : cssColor(cvTokens.colors.sidebarMuted))
    : cssColor(cvTokens.colors.mainText);

  const style = {
    fontFamily: cvTokens.fonts.primary,
    fontSize: ptToRem(cvTokens.fontSize.small),
    color,
    wordBreak: "break-all",
  };

  const resolvedHref = href === "mail"
    ? `mailto:${text}`
    : href
      ? ensureProtocol(href)
      : null;

  const content = (
    <>
      {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
      <span>{text}</span>
    </>
  );

  if (resolvedHref) {
    return (
      <a
        href={resolvedHref}
        target="_blank"
        rel="noreferrer"
        className={inline ? "inline-flex items-center gap-1" : "flex items-center gap-2"}
        style={style}
      >
        {content}
      </a>
    );
  }

  return (
    <p
      className={inline ? "inline-flex items-center gap-1" : "flex items-center gap-2"}
      style={style}
    >
      {content}
    </p>
  );
}
