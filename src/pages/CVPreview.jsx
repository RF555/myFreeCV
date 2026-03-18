import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Pencil, Printer } from "lucide-react";
import { formatYearRange } from "../components/cv/ItemModal";

const defaultCV = {
  personal: { name: "", phone: "", email: "", github: "", linkedin: "" },
  summary: "",
  skills: [],
  languages: [],
  experience: [],
  education: [],
  workHistory: [],
  customSections: {},
  sectionOrder: [
    { id: "experience", type: "experience" },
    { id: "education", type: "education" },
    { id: "workHistory", type: "workHistory" },
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
        if (!parsed.customSections) parsed.customSections = {};
        setCV({ ...defaultCV, ...parsed });
      }
    } catch {}
  }, []);

  const { personal, summary, skills, languages, experience, education, workHistory, customSections, sectionOrder } = cv;

  const renderMainSection = (section) => {
    switch (section.type) {
      case "experience":
        return experience?.length > 0 ? (
          <div key="experience" className="mb-6">
            <SectionHeader title="Experience" />
            {experience.map((exp, i) => (
              <TimelineItem key={i} years={exp.years} primary={exp.title} secondary={exp.company} bullets={exp.bullets} />
            ))}
          </div>
        ) : null;

      case "education":
        return education?.length > 0 ? (
          <div key="education" className="mb-6">
            <SectionHeader title="Education" />
            {education.map((edu, i) => (
              <TimelineItem key={i} years={edu.years} primary={edu.degree} secondary={edu.institution} />
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
              <Button variant="outline" className="gap-2"><Pencil className="w-4 h-4" /> Edit</Button>
            </Link>
            <Button className="gap-2" onClick={() => window.print()}>
              <Printer className="w-4 h-4" /> Print / Save PDF
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
            <div className="mb-6 space-y-2">
              {personal.phone && <p className="text-xs text-slate-300">{personal.phone}</p>}
              {personal.email && <p className="text-xs text-slate-300 break-all">{personal.email}</p>}
              {personal.github && (
                <a href={personal.github} className="text-xs text-blue-300 break-all block" target="_blank" rel="noreferrer">
                  {personal.github.replace(/^https?:\/\//, "")}
                </a>
              )}
              {personal.linkedin && (
                <a href={personal.linkedin} className="text-xs text-blue-300 break-all block" target="_blank" rel="noreferrer">
                  {personal.linkedin.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>

            {/* Skills */}
            {skills?.length > 0 && (
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
            {languages?.length > 0 && (
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
            {summary && (
              <div className="mb-6">
                <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
              </div>
            )}
            {sectionOrder.map((section) => renderMainSection(section))}
          </div>
        </div>
      </div>
    </div>
  );
}