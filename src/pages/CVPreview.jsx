import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LuPencil, LuPrinter, LuFileText } from "react-icons/lu";
import { getTemplate, getAllTemplates, DEFAULT_TEMPLATE } from "../utils/templateRegistry";

const defaultCV = {
  personal: { name: "", phone: "", email: "", github: "", linkedin: "" },
  summary: "",
  skills: [],
  languages: [],
  experience: [],
  education: [],
  workHistory: [],
  references: [],
  customSections: {},
  hiddenSections: {},
  sectionOrder: [
    { id: "experience", type: "experience" },
    { id: "education", type: "education" },
    { id: "workHistory", type: "workHistory" },
    { id: "references", type: "references" },
  ],
};

export default function CVPreview() {
  const [cv, setCV] = useState(defaultCV);
  const [templateId, setTemplateId] = useState(() => {
    return localStorage.getItem("cv_template") || DEFAULT_TEMPLATE;
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cv_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed.skills)) parsed.skills = [];
        if (!parsed.sectionOrder) parsed.sectionOrder = defaultCV.sectionOrder;
        // migrate: ensure all built-in sections exist in sectionOrder
        for (const section of defaultCV.sectionOrder) {
          if (!parsed.sectionOrder.some((s) => s.id === section.id)) {
            parsed.sectionOrder.push(section);
          }
        }
        if (!parsed.customSections) parsed.customSections = {};
        if (!parsed.hiddenSections) parsed.hiddenSections = {};
        setCV({ ...defaultCV, ...parsed });
      }
    } catch {}
  }, []);

  const handleTemplateChange = (id) => {
    setTemplateId(id);
    localStorage.setItem("cv_template", id);
  };

  const template = getTemplate(templateId);
  const TemplatePreview = template.Preview;
  const personal = cv.personal || {};

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      {/* Toolbar */}
      <div className="bg-white border-b shadow-sm print:hidden sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">CV Preview</h1>
          <div className="flex gap-2 items-center">
            {/* Template Switcher */}
            <div className="flex border rounded-md overflow-hidden mr-2">
              {getAllTemplates().map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTemplateChange(t.id)}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    templateId === t.id
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <Link to="/editor">
              <Button variant="outline" className="gap-2"><LuPencil className="w-4 h-4" /> Edit</Button>
            </Link>
            <Button variant="outline" className="gap-2" onClick={() => template.generateDocx(cv)}>
              <LuFileText className="w-4 h-4" /> Save as Word
            </Button>
            <Button className="gap-2" onClick={() => {
              const prev = document.title;
              const now = new Date();
              const dt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
              const name = personal.name || "CV";
              document.title = `${dt} - ${name} - myFreeCV`;
              window.print();
              document.title = prev;
            }}>
              <LuPrinter className="w-4 h-4" /> Print / Save PDF
            </Button>
          </div>
        </div>
      </div>

      {/* CV Paper — rendered by active template */}
      <TemplatePreview cv={cv} />
    </div>
  );
}
