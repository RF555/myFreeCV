import {
  Document,
  Packer,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ExternalHyperlink,
  ShadingType,
  TextDirection,
  convertInchesToTwip,
} from "docx";
import { cvTokens, docxSize } from "../cv-tokens";
import {
  ensureProtocol,
  ltrParagraph,
  buildMainContent,
  downloadBlob,
  generateFilename,
} from "./docxHelpers";

const { fonts, fontSize, colors } = cvTokens;

const SIDEBAR_WIDTH = 3200; // twips (~2.2")
const MAIN_WIDTH = 7200;    // twips (~5")
const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const BORDERS_NONE = { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER };

function sidebarText(text, opts = {}) {
  return ltrParagraph({
    spacing: { after: opts.after ?? 40 },
    children: [
      new TextRun({
        text,
        font: fonts.primary,
        size: opts.size ?? docxSize(fontSize.body),
        color: opts.color ?? colors.sidebarMuted,
        bold: opts.bold ?? false,
      }),
    ],
  });
}

function sidebarHeading(text) {
  return ltrParagraph({
    spacing: { before: 200, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: colors.sidebarBorder } },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        font: fonts.heading,
        size: docxSize(fontSize.sidebarSectionHeading),
        bold: true,
        color: colors.sidebarText,
      }),
    ],
  });
}

function buildSidebarContent(personal, skills, languages, hiddenSections) {
  const children = [];

  // Name
  children.push(ltrParagraph({
    spacing: { after: 160 },
    children: [
      new TextRun({
        text: personal.name || "Your Name",
        font: fonts.heading,
        size: docxSize(fontSize.name),
        bold: true,
        color: colors.sidebarText,
      }),
    ],
  }));

  // Contact
  if (!hiddenSections.personal) {
    if (personal.phone) {
      children.push(sidebarText(`☎  ${personal.phone}`));
    }
    if (personal.email) {
      children.push(ltrParagraph({
        spacing: { after: 40 },
        children: [
          new ExternalHyperlink({
            link: `mailto:${personal.email}`,
            children: [
              new TextRun({
                text: `✉  ${personal.email}`,
                font: fonts.primary,
                size: docxSize(fontSize.body),
                color: colors.sidebarLink,
                style: "Hyperlink",
              }),
            ],
          }),
        ],
      }));
    }
    if (personal.github) {
      children.push(ltrParagraph({
        spacing: { after: 40 },
        children: [
          new ExternalHyperlink({
            link: ensureProtocol(personal.github),
            children: [
              new TextRun({
                text: `🔗  ${personal.github.replace(/^https?:\/\//, "")}`,
                font: fonts.primary,
                size: docxSize(fontSize.body),
                color: colors.sidebarLink,
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
            link: ensureProtocol(personal.linkedin),
            children: [
              new TextRun({
                text: `🔗  ${personal.linkedin.replace(/^https?:\/\//, "")}`,
                font: fonts.primary,
                size: docxSize(fontSize.body),
                color: colors.sidebarLink,
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
      children.push(sidebarText(group.label, { bold: true, color: colors.sidebarMuted, size: docxSize(fontSize.body), after: 20 }));
      for (const item of group.items || []) {
        children.push(sidebarText(`•  ${item}`, { color: colors.sidebarDimmed, size: docxSize(fontSize.small) }));
      }
    }
  }

  // Languages
  if (!hiddenSections.languages && languages?.length > 0) {
    children.push(sidebarHeading("Languages"));
    for (const lang of languages) {
      children.push(sidebarText(`•  ${lang}`, { color: colors.sidebarDimmed, size: docxSize(fontSize.small) }));
    }
  }

  return children;
}

export async function generateDocx(cvData) {
  const personal = cvData.personal || {};
  const hiddenSections = cvData.hiddenSections || {};
  const sidebarChildren = buildSidebarContent(personal, cvData.skills, cvData.languages, hiddenSections);
  const mainChildren = buildMainContent(cvData, hiddenSections);

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
            shading: { type: ShadingType.CLEAR, fill: colors.sidebarBg },
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
  downloadBlob(blob, generateFilename(personal.name));
}
