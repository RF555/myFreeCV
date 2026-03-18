import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Pencil, Printer } from "lucide-react";

const defaultCV = {
  personal: { name: "", phone: "", email: "", github: "", linkedin: "" },
  summary: "",
  skills: { programmingLanguages: [], databases: [], aiml: [], softwareArchitecture: [] },
  languages: [],
  experience: [],
  education: [],
  workHistory: [],
};

export default function CVPreview() {
  const [cv, setCV] = useState(defaultCV);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cv_data");
      if (saved) setCV(JSON.parse(saved));
    } catch {}
  }, []);

  const { personal, summary, skills, languages, experience, education, workHistory } = cv;

  const renderSkillList = (items) =>
    items && items.length > 0 ? (
      <div className="flex flex-wrap gap-x-6">
        {items.map((s, i) => (
          <span key={i} className="text-sm">• {s}</span>
        ))}
      </div>
    ) : null;

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      {/* Toolbar */}
      <div className="bg-white border-b shadow-sm print:hidden sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">CV Preview</h1>
          <div className="flex gap-2">
            <Link to="/editor">
              <Button variant="outline" className="gap-2">
                <Pencil className="w-4 h-4" /> Edit
              </Button>
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
          <div className="w-56 bg-slate-800 text-white p-6 flex-shrink-0 print:bg-slate-800 print:text-white">
            {/* Name */}
            <div className="mb-6">
              <h1 className="text-xl font-bold leading-tight">{personal.name || "Your Name"}</h1>
            </div>

            {/* Contact */}
            <div className="mb-6 space-y-2">
              {personal.phone && <p className="text-xs text-slate-300">{personal.phone}</p>}
              {personal.email && <p className="text-xs text-slate-300 break-all">{personal.email}</p>}
              {personal.github && (
                <a href={personal.github} className="text-xs text-blue-300 break-all block" target="_blank" rel="noreferrer">
                  {personal.github.replace("https://", "")}
                </a>
              )}
              {personal.linkedin && (
                <a href={personal.linkedin} className="text-xs text-blue-300 break-all block" target="_blank" rel="noreferrer">
                  {personal.linkedin.replace("https://", "")}
                </a>
              )}
            </div>

            {/* Skills */}
            {(skills.programmingLanguages?.length > 0 || skills.databases?.length > 0 || skills.aiml?.length > 0 || skills.softwareArchitecture?.length > 0) && (
              <div className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-3 border-b border-slate-600 pb-1">Skills</h2>

                {skills.programmingLanguages?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-slate-300 mb-1">Programming Languages & Frameworks</p>
                    {skills.programmingLanguages.map((s, i) => (
                      <p key={i} className="text-xs text-slate-400">• {s}</p>
                    ))}
                  </div>
                )}
                {skills.databases?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-slate-300 mb-1">Databases</p>
                    {skills.databases.map((s, i) => (
                      <p key={i} className="text-xs text-slate-400">• {s}</p>
                    ))}
                  </div>
                )}
                {skills.aiml?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-slate-300 mb-1">AI/ML & Algorithms</p>
                    {skills.aiml.map((s, i) => (
                      <p key={i} className="text-xs text-slate-400">• {s}</p>
                    ))}
                  </div>
                )}
                {skills.softwareArchitecture?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-slate-300 mb-1">Software Architecture</p>
                    {skills.softwareArchitecture.map((s, i) => (
                      <p key={i} className="text-xs text-slate-400">• {s}</p>
                    ))}
                  </div>
                )}
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
            {/* Summary */}
            {summary && (
              <div className="mb-6">
                <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
              </div>
            )}

            {/* Experience */}
            {experience?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-base font-bold uppercase tracking-wider border-b-2 border-slate-800 pb-1 mb-4">Experience</h2>
                {experience.map((exp, i) => (
                  <div key={i} className="mb-5 flex gap-4">
                    <div className="text-xs text-gray-500 w-28 flex-shrink-0 pt-0.5">{exp.years}</div>
                    <div>
                      <p className="font-bold text-sm">{exp.title}</p>
                      <p className="text-sm italic text-gray-600 mb-1">{exp.company}</p>
                      {exp.bullets?.map((b, j) => (
                        <p key={j} className="text-xs text-gray-700 mb-0.5">• {b}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {education?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-base font-bold uppercase tracking-wider border-b-2 border-slate-800 pb-1 mb-4">Education</h2>
                {education.map((edu, i) => (
                  <div key={i} className="mb-4 flex gap-4">
                    <div className="text-xs text-gray-500 w-28 flex-shrink-0 pt-0.5">{edu.years}</div>
                    <div>
                      <p className="font-bold text-sm">{edu.degree}</p>
                      <p className="text-sm italic text-gray-600">{edu.institution}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Work History */}
            {workHistory?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-base font-bold uppercase tracking-wider border-b-2 border-slate-800 pb-1 mb-4">Work History</h2>
                {workHistory.map((job, i) => (
                  <div key={i} className="mb-5 flex gap-4">
                    <div className="text-xs text-gray-500 w-28 flex-shrink-0 pt-0.5">{job.years}</div>
                    <div>
                      <p className="font-bold text-sm">{job.title}</p>
                      <p className="text-sm italic text-gray-600 mb-1">{job.organization}</p>
                      {job.description && <p className="text-xs text-gray-700 mb-1">{job.description}</p>}
                      {job.bullets?.map((b, j) => (
                        <p key={j} className="text-xs text-gray-700 mb-0.5">• {b}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}