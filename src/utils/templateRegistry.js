import SidebarTemplate from "../components/templates/SidebarTemplate";
import ATSTemplate from "../components/templates/ATSTemplate";
import { generateDocx } from "./generateDocx";
import { generateATSDocx } from "./generateATSDocx";

export const DEFAULT_TEMPLATE = "sidebar";

const templates = {
  sidebar: {
    id: "sidebar",
    label: "Two-Column",
    Preview: SidebarTemplate,
    generateDocx,
  },
  ats: {
    id: "ats",
    label: "ATS-Friendly",
    Preview: ATSTemplate,
    generateDocx: generateATSDocx,
  },
};

export function getTemplate(id) {
  return templates[id] || templates[DEFAULT_TEMPLATE];
}

export function getAllTemplates() {
  return Object.values(templates);
}
