import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PersonalInfoSection from "../components/cv/PersonalInfoSection";
import SummarySection from "../components/cv/SummarySection";
import SkillsSection from "../components/cv/SkillsSection";
import ExperienceSection from "../components/cv/ExperienceSection";
import EducationSection from "../components/cv/EducationSection";
import WorkHistorySection from "../components/cv/WorkHistorySection";
import LanguagesSection from "../components/cv/LanguagesSection";
import { Button } from "@/components/ui/button";
import { Eye, Save } from "lucide-react";
import { toast } from "sonner";

const defaultCV = {
  personal: { name: "", phone: "", email: "", github: "", linkedin: "" },
  summary: "",
  skills: {
    programmingLanguages: [],
    databases: [],
    aiml: [],
    softwareArchitecture: [],
  },
  languages: [],
  experience: [],
  education: [],
  workHistory: [],
};

export default function CVEditor() {
  const [cv, setCV] = useState(() => {
    try {
      const saved = localStorage.getItem("cv_data");
      return saved ? JSON.parse(saved) : defaultCV;
    } catch {
      return defaultCV;
    }
  });

  const save = () => {
    localStorage.setItem("cv_data", JSON.stringify(cv));
    toast.success("CV saved!");
  };

  const update = (section, value) => {
    setCV((prev) => ({ ...prev, [section]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">CV Builder</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={save} className="gap-2">
              <Save className="w-4 h-4" /> Save
            </Button>
            <Link to="/preview">
              <Button className="gap-2">
                <Eye className="w-4 h-4" /> Preview CV
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <PersonalInfoSection data={cv.personal} onChange={(v) => update("personal", v)} />
        <SummarySection data={cv.summary} onChange={(v) => update("summary", v)} />
        <SkillsSection data={cv.skills} onChange={(v) => update("skills", v)} />
        <LanguagesSection data={cv.languages} onChange={(v) => update("languages", v)} />
        <ExperienceSection data={cv.experience} onChange={(v) => update("experience", v)} />
        <EducationSection data={cv.education} onChange={(v) => update("education", v)} />
        <WorkHistorySection data={cv.workHistory} onChange={(v) => update("workHistory", v)} />

        <div className="flex justify-end gap-2 pb-10">
          <Button variant="outline" onClick={save} className="gap-2">
            <Save className="w-4 h-4" /> Save
          </Button>
          <Link to="/preview">
            <Button className="gap-2">
              <Eye className="w-4 h-4" /> Preview CV
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}