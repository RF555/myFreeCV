import {
  Paragraph,
  TextRun,
  ExternalHyperlink,
  AlignmentType,
  BorderStyle,
} from "docx";
import { cvTokens, docxSize } from "../cv-tokens";
import { formatYearRange } from "../components/cv/ItemModal";

const { fonts, fontSize, colors } = cvTokens;

export const ensureProtocol = (url) => /^https?:\/\//.test(url) ? url : `https://${url}`;

/** Create a left-aligned LTR paragraph */
export function ltrParagraph(opts) {
  return new Paragraph({ alignment: AlignmentType.LEFT, bidirectional: false, ...opts });
}

/** Build a main-content section heading */
export function mainHeading(text) {
  return ltrParagraph({
    spacing: { before: 200, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: colors.mainBorder } },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        font: fonts.heading,
        size: docxSize(fontSize.sectionHeading),
        bold: true,
        color: colors.mainHeading,
      }),
    ],
  });
}

/** Build a timeline item (experience/education/work/custom) for main content */
export function buildTimelineItem(years, primary, secondary, description, bullets) {
  const displayYears = typeof years === "object" ? formatYearRange(years) : (years || "");
  const children = [];

  const titleRuns = [];
  if (displayYears) {
    titleRuns.push(new TextRun({ text: displayYears + "    ", font: fonts.primary, size: docxSize(fontSize.small), color: colors.mainMuted }));
  }
  titleRuns.push(new TextRun({ text: primary || "", font: fonts.primary, size: docxSize(fontSize.itemTitle), bold: true, color: colors.mainHeading }));
  children.push(ltrParagraph({ spacing: { before: 120, after: 20 }, children: titleRuns }));

  if (secondary) {
    children.push(ltrParagraph({
      spacing: { after: 20 },
      children: [new TextRun({ text: secondary, font: fonts.primary, size: docxSize(fontSize.body), italics: true, color: colors.mainSecondary })],
    }));
  }

  if (description) {
    children.push(ltrParagraph({
      spacing: { after: 20 },
      children: [new TextRun({ text: description, font: fonts.primary, size: docxSize(fontSize.small), color: colors.mainText })],
    }));
  }

  for (const b of bullets || []) {
    children.push(ltrParagraph({
      spacing: { after: 10 },
      children: [new TextRun({ text: `•  ${b}`, font: fonts.primary, size: docxSize(fontSize.small), color: colors.mainText })],
    }));
  }

  return children;
}

/** Build a reference item for main content */
export function buildReferenceItem(ref) {
  const children = [];
  children.push(ltrParagraph({
    spacing: { before: 80, after: 20 },
    children: [new TextRun({ text: ref.name || "", font: fonts.primary, size: docxSize(fontSize.itemTitle), bold: true, color: colors.mainHeading })],
  }));
  const subtitle = [ref.title, ref.organization].filter(Boolean).join(", ");
  if (subtitle) {
    children.push(ltrParagraph({
      spacing: { after: 10 },
      children: [new TextRun({ text: subtitle, font: fonts.primary, size: docxSize(fontSize.small), color: colors.mainSecondary })],
    }));
  }
  if (ref.phone) {
    children.push(ltrParagraph({
      spacing: { after: 10 },
      children: [new TextRun({ text: ref.phone, font: fonts.primary, size: docxSize(fontSize.small), color: colors.mainMuted })],
    }));
  }
  if (ref.email) {
    children.push(ltrParagraph({
      spacing: { after: 10 },
      children: [new TextRun({ text: ref.email, font: fonts.primary, size: docxSize(fontSize.small), color: colors.mainMuted })],
    }));
  }
  return children;
}

/** Build main content sections (shared between sidebar and potentially other templates) */
export function buildMainContent(cv, hiddenSections) {
  const { summary, experience, education, workHistory, references, customSections, sectionOrder } = cv;
  const children = [];

  if (!hiddenSections.summary && summary) {
    children.push(ltrParagraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: summary, font: fonts.primary, size: docxSize(fontSize.body), color: colors.mainText })],
    }));
  }

  for (const section of sectionOrder || []) {
    if (hiddenSections[section.id]) continue;
    switch (section.type) {
      case "experience":
        if (experience?.length > 0) {
          children.push(mainHeading("Experience"));
          for (const exp of experience) {
            children.push(...buildTimelineItem(exp.years, exp.title, exp.company, exp.description, exp.bullets));
          }
        }
        break;
      case "education":
        if (education?.length > 0) {
          children.push(mainHeading("Education"));
          for (const edu of education) {
            children.push(...buildTimelineItem(edu.years, edu.degree, edu.institution, edu.description, edu.bullets));
          }
        }
        break;
      case "workHistory":
        if (workHistory?.length > 0) {
          children.push(mainHeading("Work History"));
          for (const job of workHistory) {
            children.push(...buildTimelineItem(job.years, job.title, job.organization, job.description, job.bullets));
          }
        }
        break;
      case "references":
        if (references?.length > 0) {
          children.push(mainHeading("References"));
          for (const ref of references) {
            children.push(...buildReferenceItem(ref));
          }
        }
        break;
      case "custom": {
        const cs = customSections?.[section.id];
        if (cs?.items?.length > 0) {
          children.push(mainHeading(cs.title));
          for (const item of cs.items) {
            children.push(...buildTimelineItem(item.years, item.title, item.subtitle, item.description, item.bullets));
          }
        }
        break;
      }
    }
  }

  if (children.length === 0) {
    children.push(ltrParagraph({ children: [] }));
  }

  return children;
}

/** Download a blob as a file */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Generate the timestamped filename */
export function generateFilename(personalName) {
  const now = new Date();
  const dt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
  const name = personalName || "CV";
  return `${dt} - ${name} - myFreeCV.docx`;
}
