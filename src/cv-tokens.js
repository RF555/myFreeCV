/**
 * CV Design Tokens — single source of truth for all visual properties.
 * Consumed by both React components (inline styles) and docx export (literal values).
 */

export const cvTokens = {
  fonts: {
    primary: "Calibri",
    heading: "Calibri",
  },

  // All sizes in pt (points)
  fontSize: {
    name: 14,
    atsName: 20,
    sectionHeading: 11,
    sidebarSectionHeading: 10,
    itemTitle: 10,
    body: 11,
    small: 10,
    contactIcon: 10,
    contact: 9,
    skillPill: 8,
  },

  // All colors as 6-char hex WITHOUT the '#' prefix (docx needs bare hex)
  colors: {
    // Sidebar
    sidebarBg: "334155",
    sidebarText: "FFFFFF",
    sidebarMuted: "CBD5E1",
    sidebarDimmed: "94A3B8",
    sidebarBorder: "475569",
    sidebarLink: "93C5FD",

    // Main content
    mainHeading: "1E293B",
    mainText: "374151",
    mainSecondary: "4B5563",
    mainMuted: "6B7280",
    mainBorder: "1E293B",

    // ATS-specific
    atsHeaderBg: "F8FAFC",
    atsAccent: "334155",
    atsDivider: "CBD5E1",
    atsSkillBg: "F1F5F9",
    atsSkillBorder: "E2E8F0",
    atsSkillText: "334155",
  },
};

/** Prepend '#' for CSS usage: "334155" → "#334155" */
export function cssColor(hex) {
  return `#${hex}`;
}

/** Convert pt to docx half-points: 10pt → 20 */
export function docxSize(pt) {
  return Math.round(pt * 2);
}

/** Convert pt to rem string (base 16px): 10pt → "0.833rem" */
export function ptToRem(pt) {
  const px = pt * (4 / 3); // 1pt = 4/3 px
  return `${(px / 16).toFixed(3)}rem`;
}
