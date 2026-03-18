import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LuGraduationCap, LuPlus, LuPencil, LuTrash2 } from "react-icons/lu";
import ItemModal, { formatYearRange } from "./ItemModal";

const SCHEMA = [
  { key: "years", label: "Years", type: "yearRange" },
  { key: "degree", label: "Degree / Title", type: "text", placeholder: "Bachelor of Science" },
  { key: "institution", label: "Institution", type: "text", placeholder: "University Name" },
  { key: "description", label: "Description (optional)", type: "textarea", placeholder: "Brief description..." },
  { key: "bullets", label: "Bullet Points", type: "bullets" },
];

export default function EducationSection({ data, onChange }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const openAdd = () => { setEditingIndex(null); setModalOpen(true); };
  const openEdit = (i) => { setEditingIndex(i); setModalOpen(true); };

  const handleSave = (item) => {
    if (editingIndex === null) {
      onChange([...(data || []), item]);
    } else {
      const updated = [...(data || [])];
      updated[editingIndex] = item;
      onChange(updated);
    }
  };

  const remove = (i) => onChange((data || []).filter((_, idx) => idx !== i));

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <LuGraduationCap className="w-4 h-4" /> Education
          </CardTitle>
          <Button size="sm" variant="outline" onClick={openAdd} className="gap-1 h-8">
            <LuPlus className="w-3 h-3" /> Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {(data || []).length === 0 && <p className="text-sm text-gray-400 text-center py-2">No education added yet.</p>}
        {(data || []).map((edu, i) => (
          <div key={i} className="border rounded-lg px-4 py-3 bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{edu.degree || "Untitled"}</p>
                <p className="text-xs text-gray-500">{[edu.institution, formatYearRange(edu.years)].filter(Boolean).join(" · ")}</p>
              </div>
              <div className="flex gap-1 ml-2 flex-shrink-0">
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => openEdit(i)}><LuPencil className="w-3 h-3" /></Button>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400 hover:text-red-600" onClick={() => remove(i)}><LuTrash2 className="w-3 h-3" /></Button>
              </div>
            </div>
            {edu.description && (
              <p className="text-xs text-gray-600 mt-2">{edu.description}</p>
            )}
            {(edu.bullets || []).length > 0 && (
              <ul className="mt-2 space-y-0.5">
                {edu.bullets.map((b, j) => (
                  <li key={j} className="text-xs text-gray-600 flex gap-1.5">
                    <span className="text-gray-400">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </CardContent>

      <ItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        schema={SCHEMA}
        initialData={editingIndex !== null ? (data || [])[editingIndex] : null}
        title={editingIndex !== null ? "Edit Education" : "Add Education"}
      />
    </Card>
  );
}