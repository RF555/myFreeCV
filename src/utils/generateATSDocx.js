import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  ExternalHyperlink,
  ShadingType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  TextDirection,
  convertInchesToTwip,
} from "docx";
import { cvTokens, docxSize } from "../cv-tokens";
import { formatYearRange } from "../components/cv/ItemModal";
import {
  ensureProtocol,
  ltrParagraph,
  buildReferenceItem,
  downloadBlob,
  generateFilename,
} from "./docxHelpers";

const { fonts, fontSize, colors } = cvTokens;

const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const BORDERS_NONE = { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER };

/* ─── Header band: single-cell table for seamless background ─── */
function buildHeaderBand(personal, hiddenSections) {
  const headerParas = [];

  // Name — large, uppercase, centered
  headerParas.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    bidirectional: false,
    spacing: { before: 0, after: 80 },
    children: [
      new TextRun({
        text: (personal.name || "Your Name").toUpperCase(),
        font: fonts.heading,
        size: docxSize(fontSize.atsName),
        bold: true,
        color: colors.mainHeading,
      }),
    ],
  }));

  // Contact line — centered with diamond/dot separators
  if (!hiddenSections.personal) {
    const parts = [];
    if (personal.phone) parts.push({ text: personal.phone });
    if (personal.email) parts.push({ text: personal.email, link: `mailto:${personal.email}` });
    if (personal.github) parts.push({ text: personal.github.replace(/^https?:\/\//, ""), link: ensureProtocol(personal.github) });
    if (personal.linkedin) parts.push({ text: personal.linkedin.replace(/^https?:\/\//, ""), link: ensureProtocol(personal.linkedin) });

    if (parts.length > 0) {
      const runs = [];
      parts.forEach((p, i) => {
        if (i > 0) {
          runs.push(new TextRun({ text: "   \u00B7   ", font: fonts.primary, size: docxSize(fontSize.contact), color: colors.atsDivider }));
        }
        if (p.link) {
          runs.push(new ExternalHyperlink({
            link: p.link,
            children: [new TextRun({ text: p.text, font: fonts.primary, size: docxSize(fontSize.contact), color: colors.mainSecondary, style: "Hyperlink" })],
          }));
        } else {
          runs.push(new TextRun({ text: p.text, font: fonts.primary, size: docxSize(fontSize.contact), color: colors.mainSecondary }));
        }
      });

      headerParas.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        bidirectional: false,
        spacing: { before: 0, after: 0 },
        children: runs,
      }));
    }
  }

  return new Table({
    visuallyRightToLeft: false,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: colors.atsHeaderBg },
            borders: BORDERS_NONE,
            textDirection: TextDirection.LEFT_TO_RIGHT,
            margins: {
              top: convertInchesToTwip(0.35),
              bottom: convertInchesToTwip(0.25),
              left: convertInchesToTwip(0.3),
              right: convertInchesToTwip(0.3),
            },
            children: headerParas,
          }),
        ],
      }),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: BORDERS_NONE,
  });
}

/* ─── Section heading: uppercase, accent color, underlined ─── */
function atsHeading(text) {
  return ltrParagraph({
    spacing: { before: 240, after: 60 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: colors.atsAccent } },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        font: fonts.heading,
        size: docxSize(fontSize.sectionHeading),
        bold: true,
        color: colors.atsAccent,
      }),
    ],
  });
}

/* ─── Timeline entry: title left, date right ─── */
function atsTimelineItem(years, primary, secondary, description, bullets) {
  const displayYears = typeof years === "object" ? formatYearRange(years) : (years || "");
  const children = [];

  const titleRuns = [
    new TextRun({ text: primary || "", font: fonts.primary, size: docxSize(fontSize.itemTitle), bold: true, color: colors.mainHeading }),
  ];
  if (displayYears) {
    titleRuns.push(new TextRun({ text: `\t${displayYears}`, font: fonts.primary, size: docxSize(fontSize.small), color: colors.mainMuted }));
  }
  children.push(new Paragraph({
    alignment: AlignmentType.LEFT,
    bidirectional: false,
    spacing: { before: 80, after: 15 },
    tabStops: [{ type: "right", position: convertInchesToTwip(7.0) }],
    children: titleRuns,
  }));

  if (secondary) {
    children.push(ltrParagraph({
      spacing: { after: 15 },
      children: [new TextRun({ text: secondary, font: fonts.primary, size: docxSize(fontSize.body), italics: true, color: colors.mainSecondary })],
    }));
  }

  if (description) {
    children.push(ltrParagraph({
      spacing: { after: 15 },
      children: [new TextRun({ text: description, font: fonts.primary, size: docxSize(fontSize.small), color: colors.mainText })],
    }));
  }

  for (const b of bullets || []) {
    children.push(ltrParagraph({
      spacing: { after: 8 },
      children: [new TextRun({ text: `•  ${b}`, font: fonts.primary, size: docxSize(fontSize.small), color: colors.mainText })],
    }));
  }

  return children;
}

/* ─── Skills: each skill as a shaded run to simulate pills ─── */
function buildSkillGroup(group) {
  const children = [];

  // Group label
  children.push(ltrParagraph({
    spacing: { before: 60, after: 30 },
    children: [
      new TextRun({
        text: group.label,
        font: fonts.primary,
        size: docxSize(fontSize.small),
        bold: true,
        color: colors.mainHeading,
      }),
    ],
  }));

  // Skill items as shaded runs on one line
  const skillRuns = [];
  for (let j = 0; j < (group.items || []).length; j++) {
    if (j > 0) {
      skillRuns.push(new TextRun({ text: "  ", font: fonts.primary, size: docxSize(fontSize.skillPill) }));
    }
    skillRuns.push(new TextRun({
      text: ` ${group.items[j]} `,
      font: fonts.primary,
      size: docxSize(fontSize.skillPill),
      color: colors.atsSkillText,
      shading: { type: ShadingType.CLEAR, fill: colors.atsSkillBg },
    }));
  }
  children.push(ltrParagraph({
    spacing: { after: 20 },
    children: skillRuns,
  }));

  return children;
}

export async function generateATSDocx(cvData) {
  const personal = cvData.personal || {};
  const hiddenSections = cvData.hiddenSections || {};
  const { summary, experience, education, workHistory, references, skills, languages, customSections, sectionOrder } = cvData;
  const children = [];

  // ── Header band ──
  children.push(buildHeaderBand(personal, hiddenSections));

  // ── Summary with left accent border ──
  if (!hiddenSections.summary && summary) {
    children.push(new Paragraph({
      alignment: AlignmentType.LEFT,
      bidirectional: false,
      spacing: { after: 80 },
      indent: { left: convertInchesToTwip(0.08) },
      border: { left: { style: BorderStyle.SINGLE, size: 6, color: colors.atsAccent, space: 4 } },
      children: [new TextRun({ text: summary, font: fonts.primary, size: docxSize(fontSize.body), color: colors.mainText })],
    }));
  }

  // ── Ordered sections ──
  for (const section of sectionOrder || []) {
    if (hiddenSections[section.id]) continue;
    switch (section.type) {
      case "experience":
        if (experience?.length > 0) {
          children.push(atsHeading("Experience"));
          for (const exp of experience) {
            children.push(...atsTimelineItem(exp.years, exp.title, exp.company, exp.description, exp.bullets));
          }
        }
        break;
      case "education":
        if (education?.length > 0) {
          children.push(atsHeading("Education"));
          for (const edu of education) {
            children.push(...atsTimelineItem(edu.years, edu.degree, edu.institution, edu.description, edu.bullets));
          }
        }
        break;
      case "workHistory":
        if (workHistory?.length > 0) {
          children.push(atsHeading("Work History"));
          for (const job of workHistory) {
            children.push(...atsTimelineItem(job.years, job.title, job.organization, job.description, job.bullets));
          }
        }
        break;
      case "references":
        if (references?.length > 0) {
          children.push(atsHeading("References"));
          for (const ref of references) {
            children.push(...buildReferenceItem(ref));
          }
        }
        break;
      case "custom": {
        const cs = customSections?.[section.id];
        if (cs?.items?.length > 0) {
          children.push(atsHeading(cs.title));
          for (const item of cs.items) {
            children.push(...atsTimelineItem(item.years, item.title, item.subtitle, item.description, item.bullets));
          }
        }
        break;
      }
    }
  }

  // ── Skills with shaded pill-style runs ──
  if (!hiddenSections.skills && skills?.length > 0) {
    children.push(atsHeading("Skills"));
    for (const group of skills) {
      children.push(...buildSkillGroup(group));
    }
  }

  // ── Languages: middle-dot separated ──
  if (!hiddenSections.languages && languages?.length > 0) {
    children.push(atsHeading("Languages"));
    children.push(ltrParagraph({
      spacing: { after: 40 },
      children: [new TextRun({ text: languages.join("  \u00B7  "), font: fonts.primary, size: docxSize(fontSize.body), color: colors.mainText })],
    }));
  }

  if (children.length === 0) {
    children.push(ltrParagraph({ children: [] }));
  }

  const doc = new Document({
    sections: [{
      properties: {
        bidi: false,
        page: {
          margin: {
            top: convertInchesToTwip(0.4),
            bottom: convertInchesToTwip(0.5),
            left: convertInchesToTwip(0.75),
            right: convertInchesToTwip(0.75),
          },
        },
      },
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, generateFilename(personal.name));
}
