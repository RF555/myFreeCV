import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LuPencil, LuPrinter, LuPhone, LuMail, LuFileText } from "react-icons/lu";
import { generateDocx } from "../utils/generateDocx";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { formatYearRange } from "../components/cv/ItemModal";

const ensureProtocol = (url) => /^https?:\/\//.test(url) ? url : `https://${url}`;

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

function SectionHeader({ title }) {
  return (
    <h2 className="text-base font-bold uppercase tracking-wider border-b-2 border-slate-800 pb-1 mb-4">{title}</h2>
  );
}

function TimelineItem({ years, primary, secondary, description, bullets }) {
  const displayYears = typeof years === "object" ? formatYearRange(years) : years;
  return (
    <div className="mb-5 flex gap-4">
      <div className="text-xs text-gray-500 w-28 flex-shrink-0 pt-0.5">{displayYears}</div>
      <div>
        <p className="font-bold text-sm">{primary}</p>
        {secondary && <p className="text-sm italic text-gray-600 mb-1">{secondary}</p>}
        {description && <p className="text-xs text-gray-700 mb-1">{description}</p>}
        {(bullets || []).map((b, j) => (
          <p key={j} className="text-xs text-gray-700 mb-0.5">• {b}</p>
        ))}
      </div>
    </div>
  );
}

export default function CVPreview() {
  const [cv, setCV] = useState(defaultCV);

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

  const { personal, summary, skills, languages, experience, education, workHistory, references, customSections, sectionOrder, hiddenSections } = cv;

  const renderMainSection = (section) => {
    switch (section.type) {
      case "experience":
        return experience?.length > 0 ? (
          <div key="experience" className="mb-6">
            <SectionHeader title="Experience" />
            {experience.map((exp, i) => (
              <TimelineItem key={i} years={exp.years} primary={exp.title} secondary={exp.company} description={exp.description} bullets={exp.bullets} />
            ))}
          </div>
        ) : null;

      case "education":
        return education?.length > 0 ? (
          <div key="education" className="mb-6">
            <SectionHeader title="Education" />
            {education.map((edu, i) => (
              <TimelineItem key={i} years={edu.years} primary={edu.degree} secondary={edu.institution} description={edu.description} bullets={edu.bullets} />
            ))}
          </div>
        ) : null;

      case "workHistory":
        return workHistory?.length > 0 ? (
          <div key="workHistory" className="mb-6">
            <SectionHeader title="Work History" />
            {workHistory.map((job, i) => (
              <TimelineItem key={i} years={job.years} primary={job.title} secondary={job.organization} description={job.description} bullets={job.bullets} />
            ))}
          </div>
        ) : null;

      case "references":
        return references?.length > 0 ? (
          <div key="references" className="mb-6">
            <SectionHeader title="References" />
            <div className="grid grid-cols-2 gap-4">
              {references.map((ref, i) => (
                <div key={i}>
                  <p className="font-bold text-sm">{ref.name}</p>
                  {ref.title && <p className="text-xs text-gray-600">{ref.title}{ref.organization ? `, ${ref.organization}` : ""}</p>}
                  {!ref.title && ref.organization && <p className="text-xs text-gray-600">{ref.organization}</p>}
                  {ref.phone && <p className="text-xs text-gray-500 mt-0.5">{ref.phone}</p>}
                  {ref.email && <p className="text-xs text-gray-500">{ref.email}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "custom": {
        const cs = customSections?.[section.id];
        if (!cs || !cs.items?.length) return null;
        return (
          <div key={section.id} className="mb-6">
            <SectionHeader title={cs.title} />
            {cs.items.map((item, i) => (
              <TimelineItem key={i} years={item.years} primary={item.title} secondary={item.subtitle} description={item.description} bullets={item.bullets} />
            ))}
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      {/* Toolbar */}
      <div className="bg-white border-b shadow-sm print:hidden sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">CV Preview</h1>
          <div className="flex gap-2">
            <Link to="/editor">
              <Button variant="outline" className="gap-2"><LuPencil className="w-4 h-4" /> Edit</Button>
            </Link>
            <Button variant="outline" className="gap-2" onClick={() => generateDocx(cv)}>
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

      {/* CV Paper */}
      <div className="max-w-4xl mx-auto my-8 print:my-0 bg-white shadow-lg print:shadow-none">
        <div className="flex min-h-[1100px] print:min-h-0">

          {/* Left Sidebar */}
          <div className="w-56 bg-slate-800 text-white p-6 flex-shrink-0">
            <div className="mb-6">
              <h1 className="text-xl font-bold leading-tight">{personal.name || "Your Name"}</h1>
            </div>

            {/* Contact */}
            {!hiddenSections?.personal && (
              <div className="mb-6 space-y-2">
                {personal.phone && (
                  <p className="text-xs text-slate-300 flex items-center gap-2">
                    <LuPhone className="w-3.5 h-3.5 flex-shrink-0" />
                    {personal.phone}
                  </p>
                )}
                {personal.email && (
                  <a href={`mailto:${personal.email}`} className="text-xs text-blue-300 break-all flex items-center gap-2" target="_blank" rel="noreferrer">
                    <LuMail className="w-3.5 h-3.5 flex-shrink-0" />
                    {personal.email}
                  </a>
                )}
                {personal.github && (
                  <a href={ensureProtocol(personal.github)} className="text-xs text-blue-300 break-all flex items-center gap-2" target="_blank" rel="noreferrer">
                    <FaGithub className="w-3.5 h-3.5 flex-shrink-0" />
                    {personal.github.replace(/^https?:\/\//, "")}
                  </a>
                )}
                {personal.linkedin && (
                  <a href={ensureProtocol(personal.linkedin)} className="text-xs text-blue-300 break-all flex items-center gap-2" target="_blank" rel="noreferrer">
                    <FaLinkedin className="w-3.5 h-3.5 flex-shrink-0" />
                    {personal.linkedin.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
            )}

            {/* Skills */}
            {!hiddenSections?.skills && skills?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-3 border-b border-slate-600 pb-1">Skills</h2>
                {skills.map((group, i) => (
                  <div key={i} className="mb-3">
                    <p className="text-xs font-semibold text-slate-300 mb-1">{group.label}</p>
                    {(group.items || []).map((s, j) => (
                      <p key={j} className="text-xs text-slate-400">• {s}</p>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Languages */}
            {!hiddenSections?.languages && languages?.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider mb-3 border-b border-slate-600 pb-1">Languages</h2>
                {languages.map((l, i) => (
                  <p key={i} className="text-xs text-slate-400">• {l}</p>
                ))}
              </div>
            )}
          </div>

          {/* Right Main Content */}
          <div className="flex-1 p-8">
            {!hiddenSections?.summary && summary && (
              <div className="mb-6">
                <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
              </div>
            )}
            {sectionOrder.filter((s) => !hiddenSections?.[s.id]).map((section) => renderMainSection(section))}
          </div>
        </div>
      </div>
    </div>
  );
}