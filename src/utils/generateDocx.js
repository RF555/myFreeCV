import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  HeadingLevel,
  ExternalHyperlink,
  ShadingType,
  TextDirection,
  convertInchesToTwip,
} from "docx";
import { formatYearRange } from "../components/cv/ItemModal";

const SIDEBAR_BG = "334155";
const SIDEBAR_WIDTH = 2800; // twips (~2")
const MAIN_WIDTH = 7600;    // twips (~5.3")
const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const BORDERS_NONE = { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER };

// Helper: create a left-aligned paragraph (forces LTR)
function ltrParagraph(opts) {
  return new Paragraph({ alignment: AlignmentType.LEFT, bidirectional: false, ...opts });
}

function sidebarText(text, opts = {}) {
  return ltrParagraph({
    spacing: { after: opts.after ?? 40 },
    children: [
      new TextRun({
        text,
        font: "Calibri",
        size: opts.size ?? 18,
        color: opts.color ?? "CBD5E1",
        bold: opts.bold ?? false,
      }),
    ],
  });
}

function sidebarHeading(text) {
  return ltrParagraph({
    spacing: { before: 200, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "475569" } },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        font: "Calibri",
        size: 20,
        bold: true,
        color: "FFFFFF",
      }),
    ],
  });
}

function mainHeading(text) {
  return ltrParagraph({
    spacing: { before: 200, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: "1E293B" } },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        font: "Calibri",
        size: 22,
        bold: true,
        color: "1E293B",
      }),
    ],
  });
}

function buildSidebarContent(personal, skills, languages, hiddenSections) {
  const children = [];

  // Name (always visible as document header)
  children.push(ltrParagraph({
    spacing: { after: 160 },
    children: [
      new TextRun({
        text: personal.name || "Your Name",
        font: "Calibri",
        size: 28,
        bold: true,
        color: "FFFFFF",
      }),
    ],
  }));

  // Contact
  if (!hiddenSections.personal) {
    if (personal.phone) {
      children.push(sidebarText(`☎  ${personal.phone}`));
    }
    if (personal.email) {
      children.push(sidebarText(`✉  ${personal.email}`));
    }
    if (personal.github) {
      children.push(ltrParagraph({
        spacing: { after: 40 },
        children: [
          new ExternalHyperlink({
            link: personal.github,
            children: [
              new TextRun({
                text: personal.github.replace(/^https?:\/\//, ""),
                font: "Calibri",
                size: 18,
                color: "93C5FD",
                style: "Hyperlink",
              }),
            ],
          }),
        ],
      }));
    }
    if (personal.linkedin) {
      children.push(ltrParagraph({
        spacing: { after: 40 },
        children: [
          new ExternalHyperlink({
            link: personal.linkedin,
            children: [
              new TextRun({
                text: personal.linkedin.replace(/^https?:\/\//, ""),
                font: "Calibri",
                size: 18,
                color: "93C5FD",
                style: "Hyperlink",
              }),
            ],
          }),
        ],
      }));
    }
  }

  // Skills
  if (!hiddenSections.skills && skills?.length > 0) {
    children.push(sidebarHeading("Skills"));
    for (const group of skills) {
      children.push(sidebarText(group.label, { bold: true, color: "CBD5E1", size: 18, after: 20 }));
      for (const item of group.items || []) {
        children.push(sidebarText(`•  ${item}`, { color: "94A3B8", size: 17 }));
      }
    }
  }

  // Languages
  if (!hiddenSections.languages && languages?.length > 0) {
    children.push(sidebarHeading("Languages"));
    for (const lang of languages) {
      children.push(sidebarText(`•  ${lang}`, { color: "94A3B8", size: 17 }));
    }
  }

  return children;
}

function buildTimelineItem(years, primary, secondary, description, bullets) {
  const displayYears = typeof years === "object" ? formatYearRange(years) : (years || "");
  const children = [];

  // Year range + title line
  const titleRuns = [];
  if (displayYears) {
    titleRuns.push(new TextRun({ text: displayYears + "    ", font: "Calibri", size: 17, color: "6B7280" }));
  }
  titleRuns.push(new TextRun({ text: primary || "", font: "Calibri", size: 20, bold: true, color: "1E293B" }));
  children.push(ltrParagraph({ spacing: { before: 120, after: 20 }, children: titleRuns }));

  if (secondary) {
    children.push(ltrParagraph({
      spacing: { after: 20 },
      children: [new TextRun({ text: secondary, font: "Calibri", size: 18, italics: true, color: "4B5563" })],
    }));
  }

  if (description) {
    children.push(ltrParagraph({
      spacing: { after: 20 },
      children: [new TextRun({ text: description, font: "Calibri", size: 17, color: "374151" })],
    }));
  }

  for (const b of bullets || []) {
    children.push(ltrParagraph({
      spacing: { after: 10 },
      children: [new TextRun({ text: `•  ${b}`, font: "Calibri", size: 17, color: "374151" })],
    }));
  }

  return children;
}

function buildReferenceItem(ref) {
  const children = [];
  children.push(ltrParagraph({
    spacing: { before: 80, after: 20 },
    children: [new TextRun({ text: ref.name || "", font: "Calibri", size: 20, bold: true, color: "1E293B" })],
  }));
  const subtitle = [ref.title, ref.organization].filter(Boolean).join(", ");
  if (subtitle) {
    children.push(ltrParagraph({
      spacing: { after: 10 },
      children: [new TextRun({ text: subtitle, font: "Calibri", size: 17, color: "4B5563" })],
    }));
  }
  if (ref.phone) {
    children.push(ltrParagraph({
      spacing: { after: 10 },
      children: [new TextRun({ text: ref.phone, font: "Calibri", size: 17, color: "6B7280" })],
    }));
  }
  if (ref.email) {
    children.push(ltrParagraph({
      spacing: { after: 10 },
      children: [new TextRun({ text: ref.email, font: "Calibri", size: 17, color: "6B7280" })],
    }));
  }
  return children;
}

function buildMainContent(cv, hiddenSections) {
  const { summary, experience, education, workHistory, references, customSections, sectionOrder } = cv;
  const children = [];

  if (!hiddenSections.summary && summary) {
    children.push(ltrParagraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: summary, font: "Calibri", size: 19, color: "374151" })],
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

  // Ensure at least one paragraph (Word requires non-empty cells)
  if (children.length === 0) {
    children.push(ltrParagraph({ children: [] }));
  }

  return children;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function generateDocx(cvData) {
  const personal = cvData.personal || {};
  const hiddenSections = cvData.hiddenSections || {};
  const sidebarChildren = buildSidebarContent(personal, cvData.skills, cvData.languages, hiddenSections);
  const mainChildren = buildMainContent(cvData, hiddenSections);

  // Ensure sidebar has at least one paragraph
  if (sidebarChildren.length === 0) {
    sidebarChildren.push(ltrParagraph({ children: [] }));
  }

  const table = new Table({
    visuallyRightToLeft: false,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: SIDEBAR_WIDTH, type: WidthType.DXA },
            shading: { type: ShadingType.CLEAR, fill: SIDEBAR_BG },
            borders: BORDERS_NONE,
            textDirection: TextDirection.LEFT_TO_RIGHT,
            margins: {
              top: convertInchesToTwip(0.3),
              bottom: convertInchesToTwip(0.3),
              left: convertInchesToTwip(0.3),
              right: convertInchesToTwip(0.25),
            },
            children: sidebarChildren,
          }),
          new TableCell({
            width: { size: MAIN_WIDTH, type: WidthType.DXA },
            borders: BORDERS_NONE,
            textDirection: TextDirection.LEFT_TO_RIGHT,
            margins: {
              top: convertInchesToTwip(0.4),
              bottom: convertInchesToTwip(0.4),
              left: convertInchesToTwip(0.4),
              right: convertInchesToTwip(0.3),
            },
            children: mainChildren,
          }),
        ],
      }),
    ],
    width: { size: SIDEBAR_WIDTH + MAIN_WIDTH, type: WidthType.DXA },
    borders: BORDERS_NONE,
  });

  const doc = new Document({
    sections: [{
      properties: {
        bidi: false,
        page: {
          margin: {
            top: convertInchesToTwip(0.3),
            bottom: convertInchesToTwip(0.3),
            left: convertInchesToTwip(0.3),
            right: convertInchesToTwip(0.3),
          },
        },
      },
      children: [table],
    }],
  });

  const blob = await Packer.toBlob(doc);

  const now = new Date();
  const dt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
  const name = personal.name || "CV";
  const filename = `${dt} - ${name} - myFreeCV.docx`;

  downloadBlob(blob, filename);
}
