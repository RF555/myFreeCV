import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import PersonalInfoSection from "../components/cv/PersonalInfoSection";
import SummarySection from "../components/cv/SummarySection";
import SkillsSection from "../components/cv/SkillsSection";
import ExperienceSection from "../components/cv/ExperienceSection";
import EducationSection from "../components/cv/EducationSection";
import WorkHistorySection from "../components/cv/WorkHistorySection";
import ReferencesSection from "../components/cv/ReferencesSection";
import LanguagesSection from "../components/cv/LanguagesSection";
import CustomSection from "../components/cv/CustomSection";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LuEye, LuEyeOff, LuSave, LuPlus, LuGripVertical } from "react-icons/lu";
import { toast } from "sonner";

const DEFAULT_SECTIONS = [
  { id: "experience", type: "experience" },
  { id: "education", type: "education" },
  { id: "workHistory", type: "workHistory" },
  { id: "references", type: "references" },
];

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
  sectionOrder: DEFAULT_SECTIONS,
};

function loadCV() {
  try {
    const saved = localStorage.getItem("cv_data");
    if (!saved) return defaultCV;
    const parsed = JSON.parse(saved);
    // migrate old skills format
    if (!Array.isArray(parsed.skills)) {
      const old = parsed.skills || {};
      parsed.skills = [
        old.programmingLanguages?.length ? { label: "Programming Languages & Frameworks", items: old.programmingLanguages } : null,
        old.databases?.length ? { label: "Databases", items: old.databases } : null,
        old.aiml?.length ? { label: "AI/ML & Algorithms", items: old.aiml } : null,
        old.softwareArchitecture?.length ? { label: "Software Architecture", items: old.softwareArchitecture } : null,
      ].filter(Boolean);
    }
    if (!parsed.sectionOrder) parsed.sectionOrder = DEFAULT_SECTIONS;
    // migrate: ensure all built-in sections exist in sectionOrder
    for (const section of DEFAULT_SECTIONS) {
      if (!parsed.sectionOrder.some((s) => s.id === section.id)) {
        parsed.sectionOrder.push(section);
      }
    }
    if (!parsed.customSections) parsed.customSections = {};
    if (!parsed.hiddenSections) parsed.hiddenSections = {};
    return parsed;
  } catch {
    return defaultCV;
  }
}

export default function CVEditor() {
  const [cv, setCV] = useState(loadCV);
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");

  useEffect(() => {
    localStorage.setItem("cv_data", JSON.stringify(cv));
  }, [cv]);

  const save = () => {
    localStorage.setItem("cv_data", JSON.stringify(cv));
    toast.success("CV saved!");
  };

  const update = (field, value) => setCV((prev) => ({ ...prev, [field]: value }));

  const openAddSection = () => { setNewSectionName(""); setAddSectionOpen(true); };

  const addCustomSection = () => {
    const title = newSectionName.trim();
    if (!title) return;
    const id = `custom_${Date.now()}`;
    const newSection = { id, title, items: [] };
    setCV((prev) => ({
      ...prev,
      customSections: { ...prev.customSections, [id]: newSection },
      sectionOrder: [...prev.sectionOrder, { id, type: "custom" }],
    }));
    setAddSectionOpen(false);
  };

  const updateCustomSection = (id, value) => {
    setCV((prev) => ({
      ...prev,
      customSections: { ...prev.customSections, [id]: value },
    }));
  };

  const deleteCustomSection = (id) => {
    setCV((prev) => {
      const cs = { ...prev.customSections };
      delete cs[id];
      return {
        ...prev,
        customSections: cs,
        sectionOrder: prev.sectionOrder.filter((s) => s.id !== id),
      };
    });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const order = [...cv.sectionOrder];
    const [moved] = order.splice(result.source.index, 1);
    order.splice(result.destination.index, 0, moved);
    setCV((prev) => ({ ...prev, sectionOrder: order }));
  };

  const toggleSection = (sectionId) => {
    setCV((prev) => {
      const hs = { ...prev.hiddenSections };
      if (hs[sectionId]) {
        delete hs[sectionId];
      } else {
        hs[sectionId] = true;
      }
      return { ...prev, hiddenSections: hs };
    });
  };

  const VisibilityToggle = ({ sectionId }) => {
    const isHidden = cv.hiddenSections?.[sectionId];
    return (
      <Button
        size="sm"
        variant="ghost"
        className="h-7 w-7 p-0"
        onClick={() => toggleSection(sectionId)}
        title={isHidden ? "Show in preview" : "Hide from preview"}
      >
        {isHidden ? <LuEyeOff className="w-4 h-4 text-gray-400" /> : <LuEye className="w-4 h-4 text-gray-500" />}
      </Button>
    );
  };

  const renderSection = (section) => {
    switch (section.type) {
      case "experience":
        return <ExperienceSection data={cv.experience} onChange={(v) => update("experience", v)} />;
      case "education":
        return <EducationSection data={cv.education} onChange={(v) => update("education", v)} />;
      case "workHistory":
        return <WorkHistorySection data={cv.workHistory} onChange={(v) => update("workHistory", v)} />;
      case "references":
        return <ReferencesSection data={cv.references} onChange={(v) => update("references", v)} />;
      case "custom": {
        const cs = cv.customSections[section.id];
        if (!cs) return null;
        return (
          <CustomSection
            section={cs}
            onChange={(v) => updateCustomSection(section.id, v)}
            onDelete={() => deleteCustomSection(section.id)}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">CV Builder</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={save} className="gap-2">
              <LuSave className="w-4 h-4" /> Save
            </Button>
            <Link to="/preview">
              <Button className="gap-2">
                <LuEye className="w-4 h-4" /> Preview CV
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Static top sections */}
        <div className={`relative ${cv.hiddenSections?.personal ? "opacity-50" : ""}`}>
          <div className="absolute -left-7 top-1/2 -translate-y-1/2 hidden md:flex">
            <VisibilityToggle sectionId="personal" />
          </div>
          <PersonalInfoSection data={cv.personal} onChange={(v) => update("personal", v)} />
        </div>
        <div className={`relative ${cv.hiddenSections?.summary ? "opacity-50" : ""}`}>
          <div className="absolute -left-7 top-1/2 -translate-y-1/2 hidden md:flex">
            <VisibilityToggle sectionId="summary" />
          </div>
          <SummarySection data={cv.summary} onChange={(v) => update("summary", v)} />
        </div>
        <div className={`relative ${cv.hiddenSections?.skills ? "opacity-50" : ""}`}>
          <div className="absolute -left-7 top-1/2 -translate-y-1/2 hidden md:flex">
            <VisibilityToggle sectionId="skills" />
          </div>
          <SkillsSection data={cv.skills} onChange={(v) => update("skills", v)} />
        </div>
        <div className={`relative ${cv.hiddenSections?.languages ? "opacity-50" : ""}`}>
          <div className="absolute -left-7 top-1/2 -translate-y-1/2 hidden md:flex">
            <VisibilityToggle sectionId="languages" />
          </div>
          <LanguagesSection data={cv.languages} onChange={(v) => update("languages", v)} />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 border-t border-dashed border-gray-300" />
          <span className="text-xs text-gray-400 flex items-center gap-1"><LuGripVertical className="w-3 h-3" /> Drag to reorder sections below</span>
          <div className="flex-1 border-t border-dashed border-gray-300" />
        </div>

        {/* Draggable sections */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                {cv.sectionOrder.map((section, index) => (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`relative ${snapshot.isDragging ? "opacity-80 shadow-xl" : ""} ${cv.hiddenSections?.[section.id] ? "opacity-50" : ""}`}
                      >
                        {/* Left-side controls: visibility toggle + drag handle */}
                        <div className="absolute -left-7 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-1">
                          <VisibilityToggle sectionId={section.id} />
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500"
                          >
                            <LuGripVertical className="w-5 h-5" />
                          </div>
                        </div>
                        {renderSection(section)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Add custom section */}
        <button
          onClick={openAddSection}
          className="w-full border-2 border-dashed border-gray-300 rounded-xl py-4 text-sm text-gray-400 hover:text-gray-600 hover:border-gray-400 transition flex items-center justify-center gap-2"
        >
          <LuPlus className="w-4 h-4" /> Add Custom Section
        </button>

        <Dialog open={addSectionOpen} onOpenChange={setAddSectionOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Add Custom Section</DialogTitle>
            </DialogHeader>
            <div className="py-2">
              <Label className="text-sm font-medium">Section Name</Label>
              <Input
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomSection()}
                placeholder="e.g. Projects, Certifications"
                className="mt-1"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddSectionOpen(false)}>Cancel</Button>
              <Button onClick={addCustomSection} disabled={!newSectionName.trim()}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="flex justify-end gap-2 pb-10">
          <Button variant="outline" onClick={save} className="gap-2">
            <LuSave className="w-4 h-4" /> Save
          </Button>
          <Link to="/preview">
            <Button className="gap-2">
              <LuEye className="w-4 h-4" /> Preview CV
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}